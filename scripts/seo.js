"use strict";

const { URL } = require("url");

function normalizeBaseUrl(url) {
  if (!url) {
    return "";
  }

  return url.endsWith("/") ? url : `${url}/`;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function normalizeKeywords(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeKeywords(entry));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function collectNames(collection) {
  if (!collection) {
    return [];
  }

  if (Array.isArray(collection)) {
    return collection
      .map((item) => (item && item.name ? item.name : item))
      .filter(Boolean);
  }

  if (typeof collection.map === "function") {
    return collection
      .map((item) => (item && item.name ? item.name : item))
      .filter(Boolean);
  }

  return [];
}

function absoluteUrl(baseUrl, path) {
  if (!baseUrl) {
    return path || "/";
  }

  if (path === "") {
    return normalizeBaseUrl(baseUrl);
  }

  return new URL(path || "/", normalizeBaseUrl(baseUrl)).toString();
}

function getDescription(page, siteDescription) {
  const explicit = stripHtml(page && page.description);
  if (explicit) {
    return truncate(explicit, 160);
  }

  const derived = stripHtml((page && (page.excerpt || page.content)) || "");
  if (derived) {
    return truncate(derived, 160);
  }

  return truncate(siteDescription, 160);
}

function getImageUrl(context, page) {
  const imagePath =
    (page && (page.thumbnail || page.banner || page.cover)) ||
    (context.theme.logo && context.theme.logo.url) ||
    (context.theme.favicon &&
      context.theme.favicon.android &&
      context.theme.favicon.android.url) ||
    "";

  if (!imagePath) {
    return "";
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return absoluteUrl(context.config.url, context.url_for(imagePath));
}

function toIsoDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toPublicPath(path) {
  const cleanPath = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");

  if (!cleanPath || cleanPath === "index.html") {
    return "";
  }

  return cleanPath.replace(/index\.html$/, "");
}

function forEachItem(collection, callback) {
  if (!collection) {
    return;
  }

  if (typeof collection.forEach === "function") {
    collection.forEach(callback);
    return;
  }

  if (typeof collection.each === "function") {
    collection.each(callback);
  }
}

hexo.extend.helper.register("seo_data", function (page) {
  const currentPage = page || this.page || {};
  const siteDescription = stripHtml(this.config.description || "");
  const description = getDescription(currentPage, siteDescription);
  const keywords = [
    ...normalizeKeywords(this.config.keywords),
    ...normalizeKeywords(currentPage.keywords),
  ].filter(Boolean);
  const uniqueKeywords = [...new Set(keywords)];
  const canonicalTarget = currentPage.canonical || this.url_for(currentPage.path || "/");
  const canonicalUrl = absoluteUrl(this.config.url, canonicalTarget);
  const imageUrl = getImageUrl(this, currentPage);
  const homeUrl = absoluteUrl(this.config.url, this.url_for("/"));
  const authorName = currentPage.author || this.config.author || this.config.title;
  const articleTags = collectNames(currentPage.tags);
  const articleSections = collectNames(currentPage.categories);
  const siteTitle = this.config.title;
  const logoUrl = getImageUrl(this, {});
  const publisher = {
    "@type": "Organization",
    name: authorName,
  };

  if (logoUrl) {
    publisher.logo = {
      "@type": "ImageObject",
      url: logoUrl,
    };
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${homeUrl}#website`,
    url: homeUrl,
    name: siteTitle,
    description: siteDescription,
    inLanguage: this.config.language || "en",
  };

  const schemas = [websiteSchema];

  if (this.is_home()) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${homeUrl}#blog`,
      url: homeUrl,
      name: siteTitle,
      description: siteDescription,
      inLanguage: this.config.language || "en",
      publisher,
    });
  } else if (this.is_post()) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#blogposting`,
      headline: currentPage.title || siteTitle,
      description,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      datePublished: toIsoDate(currentPage.date),
      dateModified: toIsoDate(currentPage.updated || currentPage.date),
      inLanguage: this.config.language || "en",
      author: publisher,
      publisher,
      isPartOf: {
        "@id": `${homeUrl}#blog`,
      },
      keywords: uniqueKeywords.join(", "),
    };

    if (imageUrl) {
      articleSchema.image = [imageUrl];
    }

    if (articleTags.length) {
      articleSchema.about = articleTags;
    }

    if (articleSections.length) {
      articleSchema.articleSection = articleSections;
    }

    schemas.push(articleSchema);
  } else {
    const pageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: currentPage.title || siteTitle,
      description,
      inLanguage: this.config.language || "en",
      isPartOf: {
        "@id": `${homeUrl}#website`,
      },
    };

    if (imageUrl) {
      pageSchema.primaryImageOfPage = {
        "@type": "ImageObject",
        url: imageUrl,
      };
    }

    schemas.push(pageSchema);
  }

  return {
    title: this.page_title(),
    description,
    keywords: uniqueKeywords.join(", "),
    canonicalUrl,
    imageUrl,
    authorName,
    publishedTime: toIsoDate(currentPage.date),
    modifiedTime: toIsoDate(currentPage.updated || currentPage.date),
    schemas,
  };
});

hexo.extend.generator.register("seo-files", function (locals) {
  const baseUrl = normalizeBaseUrl(hexo.config.url);
  const entries = [];
  const seen = new Set();
  let latestUpdate = new Date().toISOString();

  function pushEntry(path, updated, changefreq, priority) {
    const publicPath = toPublicPath(path);
    const absolute = absoluteUrl(baseUrl, publicPath || "");

    if (seen.has(absolute)) {
      return;
    }

    seen.add(absolute);
    entries.push({
      loc: absolute,
      lastmod: toIsoDate(updated) || latestUpdate,
      changefreq,
      priority,
    });
  }

  forEachItem(locals.posts, function (post) {
    const updated = post.updated || post.date;
    const isoUpdated = toIsoDate(updated);

    if (isoUpdated && isoUpdated > latestUpdate) {
      latestUpdate = isoUpdated;
    }

    pushEntry(post.path, updated, "monthly", "0.80");
  });

  pushEntry("", latestUpdate, "weekly", "1.00");
  pushEntry("archives/", latestUpdate, "weekly", "0.70");

  forEachItem(locals.pages, function (page) {
    pushEntry(page.path, page.updated || page.date || latestUpdate, "monthly", "0.60");
  });

  if (locals.tags && locals.tags.length) {
    pushEntry("tags/", latestUpdate, "weekly", "0.50");
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(function (entry) {
      return [
        "  <url>",
        `    <loc>${xmlEscape(entry.loc)}</loc>`,
        `    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n");
    }),
    "</urlset>",
  ].join("\n");

  const robots = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${absoluteUrl(baseUrl, "sitemap.xml")}`,
  ].join("\n");

  const manifest = JSON.stringify(
    {
      name: hexo.config.title,
      short_name: "Session0",
      description: stripHtml(hexo.config.description || ""),
      start_url: hexo.config.root || "/",
      scope: hexo.config.root || "/",
      display: "standalone",
      background_color: "#111827",
      theme_color: "#111827",
      icons: [
        {
          src: `${hexo.config.root || "/"}images/favicon-192x192.png`,
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: `${hexo.config.root || "/"}images/apple-touch-icon.png`,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    null,
    2,
  );

  return [
    {
      path: "sitemap.xml",
      data: sitemap,
    },
    {
      path: "robots.txt",
      data: robots,
    },
    {
      path: "site.webmanifest",
      data: manifest,
    },
  ];
});
