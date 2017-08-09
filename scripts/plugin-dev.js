const { join, resolve } = require('path');
const { execSync } = require('child_process');
const { statSync } = require('fs');
const webpack = require('webpack');
const chalk = require('chalk');

const HOME_DIRECTORY = execSync(`cd ~ && pwd`).toString().trim();

const { install } = require('./copy-hyper')(HOME_DIRECTORY);


const args = process.argv.slice(2);
const pluginName = args[0];

const PLUGIN_BASE_PATH = join(HOME_DIRECTORY, 'dotfiles', `hyper/hyper_plugins/local/`);
const PLUGIN_PATH = join(PLUGIN_BASE_PATH, pluginName);
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
	console.log(`Installing ${pluginName}...`);

	install(pluginName);
	console.log('Waiting...');
});
