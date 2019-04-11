module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://localhost:9966',
                changeOrigin:true,
               /* pathRewrite:{
                    '/api':''
                }*/
                pathRewrite: {'^/api' : ''}
            }
        }
    }
}