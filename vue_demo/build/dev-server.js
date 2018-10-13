const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const config = require('../config')
const webpackConfig = process.env.NODE_ENV === 'testing'
      ? require('./webpack.prod.conf')
      : require('./webpack.dev.conf')

//default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
//define HTTP proxies to your custom API backend
var proxyTable = config.dev.proxyTable

const app = express()

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler,{
    publicPath: webpackConfig.output.publicPath,
    status: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
//force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb){
    hotMiddleware.publish({action: 'reload'})
    cb()
})
})

var appData = require('../data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()

apiRoutes.get('/seller', function(req, res){
    res.json({
        errno: 0,
        data: seller
    })
})

apiRoutes.get('/goods', function(req, res){
    res.json({
        errno: 0,
        data: goods
    })
})

apiRoutes.get('/ratings', function(req, res){
    res.json({
        errno: 0,
        data: ratings
    })
})

app.use('/api', apiRoutes)

//proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
})

//handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

//serve webpack bundle output
app.use(devMiddleware)

//enable hot-reload and state-preserving
//compilation error display
app.use(hotMiddleware)

//serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPub, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://hostlocal:' + port + '\n')
})