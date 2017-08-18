module.exports = {
	entry: `${__dirname}/index.js`,
	output: {
		path: `${__dirname}/dist`,
		filename: 'index.js',
		libraryTarget: 'commonjs'
	},
	target: 'node'
};
