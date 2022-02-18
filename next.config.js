const { i18n } = require('./next-i18next.config')
 
module.exports = {
  i18n,
  images: {
    domains: [
      "images.unsplash.com", 
      "193.46.199.82", 
      "api.igt-webdev.site",
      "igt-webdev.com",
    ]
  },
  pageExtensions: ['mdx', 'jsx', 'js', 'ts', 'tsx'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  target: "experimental-serverless-trace",
}