const { join, resolve } = require('path');
const { exec } = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');

const args = process.argv.slice(2);
const pluginDir = args[0];

const PLUGIN_BASE_PATH = join(__dirname, `hyper/hyper_plugins/local/`);
const PLUGIN_PATH = join(PLUGIN_BASE_PATH, pluginDir);
const PLUGIN_CONFIG = require(join(PLUGIN_PATH, 'webpack.config.js'));

// in the plugin's webpack config file, context defaults to process.cwd().
// we want to set it to the desired plugin directory
PLUGIN_CONFIG.context = PLUGIN_PATH;

const compiler = webpack(PLUGIN_CONFIG);

compiler.watch({
	context: PLUGIN_PATH
}, (err, stats) => {
	if (err) {
		throw err;
	}

	if (stats.hasErrors()) {
		console.log(chalk.red('Compilation failed'));
		console.log(stats.toJson('errors-only'));
		return;
	}

	console.log(chalk.green('Compiled successfully.'));
	console.log()
});
