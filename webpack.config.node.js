// for babel-plugin-webpack-loaders
import devConfigs from './webpack.config.development'

export default {
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: devConfigs.module.loaders.slice(1) // remove babel-loader
  }
}
