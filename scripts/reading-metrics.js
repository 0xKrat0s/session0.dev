"use strict";

const { stripHTML } = require("hexo-util");

const defaultConfig = {
  exclude_codeblock: false,
  awl: 4,
  wpm: 275,
  suffix: "mins.",
};

function getConfig() {
  return Object.assign({}, defaultConfig, hexo.config.symbols_count_time || {});
}

function getContent(post) {
  return post.content || post.excerpt || "";
}

function getSymbols(post, config) {
  if (typeof post.length === "number" && Number.isFinite(post.length)) {
    return post.length;
  }

  let content = getContent(post);

  if (config.exclude_codeblock) {
    content = content.replace(/<pre>[\s\S]*?<\/pre>/g, "");
  }

  return stripHTML(content).replace(/\r?\n|\r/g, "").replace(/\s+/g, "").length;
}

function formatSymbols(symbols) {
  if (symbols > 9999) {
    return `${Math.round(symbols / 1000)}k`;
  }

  if (symbols > 999) {
    return `${Math.round(symbols / 100) / 10}k`;
  }

  return String(symbols);
}

function formatTime(minutes, suffix) {
  const hours = Math.floor(minutes / 60);
  let mins = Math.floor(minutes - hours * 60);

  if (mins < 1) {
    mins = 1;
  }

  if (hours < 1) {
    return `${mins} ${suffix}`;
  }

  return `${hours}:${`00${mins}`.slice(-2)}`;
}

hexo.extend.helper.register("readingSymbolsCount", function(post) {
  const config = getConfig();
  return formatSymbols(getSymbols(post, config));
});

hexo.extend.helper.register("readingTimeText", function(post) {
  const config = getConfig();
  const symbols = getSymbols(post, config);
  const minutes = Math.round(symbols / (config.awl * config.wpm));
  return formatTime(minutes, config.suffix);
});
