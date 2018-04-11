const fs = require ('fs');
const path = require ('path');

const webpack = require ('webpack');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require ('html-webpack-plugin');


const extractStylus = new ExtractTextPlugin('static/styles/[name].css');

const createHtmlPlugins = function(templateDir) {
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
	return templateFiles.map(item => {
		const parts = item.split('.');
		const name = parts[0];
		const extension = parts[1];
		return new HtmlWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
			inject: false
		})
	})
}

const HTMLPLUGINS = createHtmlPlugins('./src/pug/pages');

const conf = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		main: './src/static/js/main.js'
	},
	output: {
		filename: 'static/js/[name].js',
		path: __dirname + '/dist'
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [{
					loader: 'html-loader'
				},{
					loader: 'pug-html-loader',
					options: {
						data: {},
						pretty: true
					}
				}]
			},
			{
				test: /\.styl$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					use: [{
						loader: 'css-loader',
						options: {sourceMap: true}
					},{
						loader: 'stylus-loader',
						options: {sourceMap: true}
					}]
				})
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'file-loader',
					options: {
						// для сохранения структуры директорий, хранящих изображения
						context: './src/',
						useRelativePath: true,
						name: '[name].[ext]'
					}
				}]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						context: './src/',
						useRelativePath: true,
						name: '[name].[ext]'
					}
				}]
      },
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [
		extractStylus,
		new webpack.HotModuleReplacementPlugin({

		})
	].concat(HTMLPLUGINS)
}

module.exports = conf;
