const config = {
	mode: 'production',
	entry: {
		index: './src/js/index.js',
		notIndex: './src/js/notIndex.js',
	},
	output: {
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
