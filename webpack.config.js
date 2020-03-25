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
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react'],
						plugins: ["@babel/plugin-proposal-class-properties"],
					}
				}
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		]
	}
}
// npx babel --presets @babel/preset-env  --presets @babel/preset-react ./src --out-dir ./transpiled;  npx webpack
// ./transpiled -o dist/bundle.js --mode development;