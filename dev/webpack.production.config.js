var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('./config.js');

module.exports = {
	entry: config.entry,
	output: config.output,
	module: {
		rules: [
			{
				test: /\.js$/,
				//exclude: /node_modules\/(?!(ml-matrix|ml-array-max|ml-array-mim|ml-array-rescale|ml-levenberg-marquardt)\/).*/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader'
					},{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')
							]
						}
					},{
						loader: 'less-loader'
					}]
				})
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{
						loader: 'css-loader'
					},{
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')
							]
						}
					}]
				})
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {'NODE_ENV': '"production"'}
		}),
		new webpack.ProvidePlugin(config.globals),
		new webpack.optimize.OccurrenceOrderPlugin(),
		//new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin(config.styleFilename)
	]
};
