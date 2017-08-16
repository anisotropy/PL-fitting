var webpack = require('webpack');
var config = require('./config.js');

module.exports = {
	devtool: 'eval-source-map',
	entry: config.entry,
	output: config.output,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['react', 'es2015']
				}
			},
			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader'
				},{
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
			},
			{
				test: /\.css$/,
				use: [{
					loader: 'style-loader'
				},{
					loader: 'css-loader'
				},{
					loader: 'postcss-loader',
					options: {
						plugins: [
							require('autoprefixer')
						]
					}
				}]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin(config.globals)
	]
};
