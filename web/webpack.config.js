var path = require('path');


module.exports = {
	entry: [
		// 'webpack/hot/dev-server',
		// 'webpack-dev-server/client?http://localhost:8080',
		path.resolve(__dirname, './src/index.js')
		// path.resolve(__dirname, './src/js/app.js')
	],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
	},
	devtool: "source-map",
	module: {
  		loaders: [{
			test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
			exclude: /node_modules/,
			loader: 'babel', // The module to load. "babel" is short for "babel-loader"
			query: {
				// presets: ['r eact']
				presets: ['react', 'es2015']
			}
	 	},
		{ test: /\.css$/, loader: "style-loader!css-loader" },
		//{ test: /\.css$/, loader: "style!css" },
		{ test: /\.scss$/, loader: 'style!css!sass'}
		]
	},
	resolve: {
	  // 設定後只需要寫 require('file') 而不用寫成 require('file.coffee')
	  extensions: ['', '.js', '.json', '.coffee']
	}
};

//module.exports = config;
