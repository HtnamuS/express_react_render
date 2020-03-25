module.exports = {
	mode: 'development',
	entry: './src',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			}
		]
	}
}
// npx babel --presets @babel/preset-env  --presets @babel/preset-react ./src --out-dir ./transpiled;  npx webpack
// ./transpiled -o dist/bundle.js --mode development;