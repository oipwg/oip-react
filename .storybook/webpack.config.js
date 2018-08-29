module.exports = {
	plugins: [],
	module: {
		rules: [
			{
				test: /.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['@babel/env', '@babel/react']
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(png|jpg|gif|ttf|woff|woff2|eot|svg)$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			}
		]
	},
	node: {
		fs: "empty"
	},
	externals: {
		'jsdom': 'window',
		'cheerio': 'window',
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': 'window',
		'react/addons': true,
	}
};
