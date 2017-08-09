module.exports = {
	entry: `${__dirname}/index.js`,
	output: {
		path: `${__dirname}/dist`,
		filename: 'index.js',
		libraryTarget: 'commonjs'
	},
	target: 'node',
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: /.js$/,
				query: {
					presets: ['es2015', 'react', 'stage-2']
				}
			}
		]
	}
};
