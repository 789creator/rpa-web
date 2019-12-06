/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    editor: {
      // page 的入口
      entry: 'src/editor.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/editor.html 的输出
      filename: 'editor.html',
      chunks: ['chunk-vendors', 'chunk-common', 'editor']
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      console.log('i am dev')
      config.devtool = 'cheap-module-eval-source-map'
      return {}
    } else {
      return {
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                warnings: false,
                compress: {
                  drop_console: true, // console
                  drop_debugger: true,
                  pure_funcs: ['console.log'] // 移除console
                }
              },
              sourceMap: false
            })
          ]
        },
        plugins: [
          new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require('./public/vendor/vendor-manifest.json')
          }),
          // 将 dll 注入到 生成的 html 模板中
          new AddAssetHtmlPlugin({
            // dll文件位置
            filepath: path.resolve(__dirname, './public/vendor/*.js'),
            // dll 引用路径
            publicPath: './vendor',
            // dll最终输出的目录
            outputPath: './vendor'
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
  },
  productionSourceMap: false,
  devServer: {
    open: false,
    port: 8001,
    overlay: {
      errors: true,
      warnings: true
    }
  }
}
