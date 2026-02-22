// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MichMesh',
  tagline: 'Free Off-Grid Mesh Network for Everyone',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://michmesh.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'MichMesh',
        logo: {
          alt: 'MichMesh Logo',
          src: 'img/michmesh-logo.svg',
          srcDark: 'img/michmesh-logo-dark.svg',
        },
        items: [
		{
		  href:     'https://signal.group/#CjQKIG5-o6UUXvto66c1wN4fbinuguy614cJtRPmMxUA6JWyEhBKp6Q70OkA2MpcjsBYU1r9',
		  label:    'Signal',
		  position: 'right'
		},
		{
		  href:     'https://discord.gg/skgWyPuft8',
		  label:    'Discord',
		  position: 'right'
		}	
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/DmM6cMPRTz',
              },
	      {
      	        href:     'https://signal.group/#CjQKIG5-o6UUXvto66c1wN4fbinuguy614cJtRPmMxUA6JWyEhBKp6Q70OkA2MpcjsBYU1r9',
		label:    'Signal',
	      },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/MichMesh/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyleft ${new Date().getFullYear()} MichMesh disorganization. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  markdown: {
    format: 'mdx',
    mermaid: true,
    emoji: true,
    preprocessor: ({filePath, fileContent}) => {
      return fileContent.replaceAll('{{MY_VAR}}', 'MY_VALUE');
    },
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      result.frontMatter.description =
        result.frontMatter.description?.replaceAll('{{MY_VAR}}', 'MY_VALUE');
      return result;
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
    anchors: {
      maintainCase: true,
    },
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'throw',
    },
  },
};

export default config;
