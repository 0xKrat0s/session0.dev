# Session0 Logbook

A clean, modern blog about ethical hacking, penetration testing, bug bounties, and information security built with **Hexo** and the **hexo-theme-cactus** theme.

**Live Site:** [https://session0.dev](https://session0.dev)

---

## Table of Contents

- [About This Project](#about-this-project)
- [What is Hexo?](#what-is-hexo)
- [About hexo-theme-cactus](#about-hexo-theme-cactus)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Creating New Posts](#creating-new-posts)
- [Deployment](#deployment)
- [File Structure](#file-structure)

---

## About This Project

Session0 Logbook is a dedicated platform for sharing knowledge and insights on:

- Ethical Hacking
- Penetration Testing
- Bug Bounty Hunting
- Web Application Security
- CTF Writeups
- Hands-on InfoSec Tips

The blog features a responsive design, fast performance, and clean typography powered by modern web technologies.

---

## What is Hexo?

[Hexo](https://hexo.io) is a fast, simple, and powerful blog framework built on Node.js. It enables developers to:

- Write posts in **Markdown** with minimal friction
- Generate static HTML files for blazing-fast performance
- Deploy to multiple hosting platforms effortlessly
- Customize with themes and plugins
- Use a command-line interface for efficient workflows

**Key Features:**
- Lightning-fast site generation
- Support for hundreds of themes
- Extensive plugin ecosystem
- Built-in server and live reloading
- Multi-language support
- SEO-friendly architecture

Hexo transforms your Markdown files into a fully functional blog with minimal configuration, making it ideal for technical writers and security professionals.

---

## About hexo-theme-cactus

[hexo-theme-cactus](https://github.com/probberechts/hexo-theme-cactus) is a minimalist, responsive theme designed for clarity and elegance.

### Why Cactus?

- **Minimalist Design**: Focuses on content without visual clutter
- **Responsive**: Looks great on desktop, tablet, and mobile devices
- **Performance**: Lightweight and optimized for speed
- **Typography**: Beautiful font rendering for enhanced readability
- **Dark Mode Support**: Comfortable reading in any lighting condition
- **Accessibility**: Built with modern web standards
- **Customizable**: Easy to adjust colors, fonts, and layouts

### Theme Highlights

- Clean, modern aesthetic
- Fully responsive design
- Dark mode support
- Built-in search functionality
- Reading time estimates
- Tag and category support
- SEO optimization
- Customizable color schemes  

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **Git** - [Download](https://git-scm.com)
- A text editor (VS Code, Sublime Text, etc.)

### Installation

Follow these steps to create a blog similar to Session0 Logbook:

#### 1. Create a new Hexo project

```bash
# Install Hexo CLI globally
npm install -g hexo-cli

# Create a new blog directory
hexo init my-blog
cd my-blog

# Install dependencies
npm install
```

#### 2. Install and configure hexo-theme-cactus

```bash
# Clone the Cactus theme into the themes directory
cd themes
git clone https://github.com/probberechts/hexo-theme-cactus.git hexo-theme-cactus
cd ..

# Update _config.yml to use the theme
```

Edit `_config.yml` and change:

```yaml
# Site configuration
title: Your Blog Title
subtitle: Your blog subtitle
description: Your blog description
author: Your Name
language: en

# Theme configuration
theme: hexo-theme-cactus
```

#### 3. Configure the theme

Edit `themes/hexo-theme-cactus/_config.yml` to customize:

```yaml
# Theme settings
colorScheme: light  # or dark
nav:
  - name: Home
    path: /
  - name: About
    path: /about
  - name: Archives
    path: /archives
  - name: Tags
    path: /tags

footer:
  - title: GitHub
    href: https://github.com/yourusername
  - title: Twitter
    href: https://twitter.com/yourusername
```

#### 4. Install required plugins

```bash
npm install hexo-generator-archive \
            hexo-generator-category \
            hexo-generator-index \
            hexo-generator-tag \
            hexo-renderer-ejs \
            hexo-renderer-marked \
            hexo-renderer-stylus \
            hexo-server
```

Optional plugins for enhanced functionality:

```bash
npm install hexo-math              # Mathematical notation support
npm install hexo-symbols-count-time # Reading time estimates
npm install hexo-deployer-git      # Deploy to GitHub Pages
```

---

## Usage

### Start Development Server

```bash
# Start local server with live reloading
hexo server

# Access at http://localhost:4000
```

### Generate Static Files

```bash
# Build the blog for production
hexo generate

# Output files will be in the 'public' directory
```

### Clean Build

```bash
# Remove database and public files (useful for troubleshooting)
hexo clean

# Regenerate everything
hexo generate
```

---

## Configuration

### Main Configuration (_config.yml)

Key settings for your blog:

```yaml
# Site metadata
title: Session0 Logbook
subtitle: Notes from the session0 lab
description: Security blog covering ethical hacking...
keywords:
  - session0
  - ethical hacking
  - penetration testing

# Author
author: Session0
timezone: Asia/Kolkata

# URLs and permalinks
url: https://session0.dev
permalink: blog/:title/

# Writing
new_post_name: :title.md
default_layout: post
```

### Theme Configuration (themes/hexo-theme-cactus/_config.yml)

Customize theme appearance and behavior to match your branding and preferences.

---

## Creating New Posts

### Create a new post

```bash
hexo new post "Your Post Title"
```

This generates `source/_posts/your-post-title.md`

### Post frontmatter

```markdown
---
title: Penetration Testing 101
date: 2026-04-22 10:30:00
tags:
  - penetration testing
  - security
categories:
  - tutorials
---

Your content here in Markdown...
```

### Supported frontmatter options

- `title`: Post title
- `date`: Publication date
- `updated`: Last modified date
- `tags`: Array of tags
- `categories`: Array of categories
- `description`: Post excerpt
- `keywords`: SEO keywords
- `comments`: Enable/disable comments
- `toc`: Show table of contents

---

## Deployment

### Deploy to GitHub Pages

#### 1. Create a GitHub repository

```bash
# Initialize git in your project
git init

# Add your GitHub remote
git remote add origin https://github.com/yourusername/yourblog.git
```

#### 2. Install git deployer

```bash
npm install hexo-deployer-git --save
```

#### 3. Configure deployment in _config.yml

```yaml
deploy:
  type: git
  repo: https://github.com/yourusername/yourblog.git
  branch: gh-pages
```

#### 4. Deploy

```bash
hexo deploy
```

### Deploy to other platforms

Hexo supports deployment to:

- **GitHub Pages** - Free static hosting
- **Netlify** - CI/CD with custom domains
- **Vercel** - Serverless deployment
- **AWS S3** - Cloud storage
- **Traditional hosting** - Via FTP/SFTP

---

## File Structure

```
my-blog/
├── _config.yml              # Main configuration
├── _config.landscape.yml    # Landscape theme config (if used)
├── package.json             # Node.js dependencies
├── source/                  # Blog content
│   ├── _posts/             # Blog posts
│   ├── about/              # About page
│   └── notes/              # Additional pages
├── themes/                  # Installed themes
│   └── hexo-theme-cactus/  # Cactus theme
├── scaffolds/              # Post templates
├── public/                 # Generated static files (output)
└── scripts/                # Custom scripts
```

---

## Advanced Customization

### Add a custom CSS file

1. Create `themes/hexo-theme-cactus/source/css/custom.css`
2. Add to theme config:

```yaml
inject:
  head: '<link rel="stylesheet" href="/css/custom.css">'
```

### Modify theme colors

Edit `themes/hexo-theme-cactus/source/css/_colors/default.styl` to customize the color palette.

### Add custom JavaScript

Place files in `themes/hexo-theme-cactus/source/js/` and reference in layout files.

---

## Performance Tips

- Use `hexo clean && hexo generate` before deployment
- Optimize images before adding to posts
- Enable caching in your hosting provider
- Use a CDN for static assets
- Monitor build time with `--debug` flag

---

## Troubleshooting

### Port already in use

```bash
hexo server -p 5000  # Use a different port
```

### Changes not appearing

```bash
hexo clean
hexo generate
hexo server
```

### Theme not loading

- Ensure theme folder name matches `_config.yml`
- Check theme `_config.yml` for errors
- Verify all dependencies are installed

---

## Resources

- [Hexo Documentation](https://hexo.io/docs)
- [hexo-theme-cactus Repository](https://github.com/probberechts/hexo-theme-cactus)
- [Hexo Plugins](https://hexo.io/plugins)
- [Node.js Documentation](https://nodejs.org/docs)

---

## License

This blog content is provided for educational purposes. The Hexo framework is open-source, and hexo-theme-cactus is available under its respective license.

---

## Support

For issues or questions:

- Check the [Hexo documentation](https://hexo.io/docs)
- Visit the [Cactus theme issues](https://github.com/probberechts/hexo-theme-cactus/issues)
- Refer to this README's troubleshooting section

---

**Built with Hexo and hexo-theme-cactus**
