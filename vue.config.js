module.exports = {
    lintOnSave: process.env.NODE_ENV !== 'production',
    css: {
      loaderOptions: {
        sass: {
          implementation: require('sass')
        }
      }
    }
  }
