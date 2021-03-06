
module.exports = {
  env: {
    baseUrl: 'https://rop.zjuqsc.com/api',
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '求是潮纳新开放平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'QSC ROP' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
      { rel: 'stylesheet', href: 'https://fonts.loli.net/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  modules: [
    '@nuxtjs/sentry',
  ],

  sentry: {
    public_key: '81fdfb8356544d328d3e6a5bca6e534a',
    private_key: '68f0afa8025a4c568f0f0a323abba1a3',
    project_id: '2',
    config: {
      // Additional config
    },
  },
  plugins: ['~/plugins/vuetify.js'],
  css: [
    '~/assets/style/app.styl'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js',
      'babel-polyfill'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    // extend (config, ctx) {
    //   if (ctx.isDev && ctx.isClient) {
    //     config.module.rules.push({
    //       enforce: 'pre',
    //       test: /\.(js|vue)$/,
    //       loader: 'eslint-loader',
    //       exclude: /(node_modules)/
    //     })
    //   }
    // }
  }
}
