import { env } from 'node:process'

const baseURL = env.NUXT_APP_BASE_URL || '/'
const siteURL = env.NUXT_PUBLIC_SITE_URL || 'https://moeka.app'
const isProduction = env.NODE_ENV === 'production'
const withBaseURL = (path: string) => baseURL === '/' ? path : `${baseURL.replace(/\/$/, '')}${path}`

export default {
  compatibilityDate: '2026-06-14',
  modules: [['@nuxtjs/robots', { robotsTxt: baseURL === '/' }]],
  css: ['~/assets/styles/main.less'],
  runtimeConfig: {
    public: {
      siteURL,
    },
  },
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: false,
      routes: ['/', '/zh-cn', '/zh-tw', '/ja', '/ko', '/en'],
    },
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: 'Moeka - Markdown Editor',
      link: [
        { rel: 'icon', href: withBaseURL('/favicon.ico'), sizes: 'any' },
        { rel: 'icon', type: 'image/png', href: withBaseURL('/images/favicon-32.png'), sizes: '32x32' },
        { rel: 'icon', type: 'image/webp', href: withBaseURL('/images/feature-icon-1.webp') },
        { rel: 'apple-touch-icon', href: withBaseURL('/images/apple-touch-icon.png'), sizes: '180x180' },
        { rel: 'manifest', href: withBaseURL('/site.webmanifest') },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#f3ecdf' },
        { name: 'application-name', content: 'Moeka' },
        { name: 'apple-mobile-web-app-title', content: 'Moeka' },
      ],
      script: isProduction ? [
        {
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-LZESBWWCL2',
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LZESBWWCL2');
          `,
        },
      ] : [],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          math: 'always',
        },
      },
    },
  },
}
