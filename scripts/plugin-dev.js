const { join } = require('path');
const { execSync } = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');

const HOME_DIRECTORY = execSync('cd ~ && pwd').toString().trim();

const { copy } = require('./helpers/copy-hyper')(HOME_DIRECTORY);

const args = process.argv.slice(2);
const pluginName = args[0];

const PLUGIN_BASE_PATH = join(HOME_DIRECTORY, 'dotfiles', 'hyper/hyper_plugins/local/');
const PLUGIN_PATH = join(PLUGIN_BASE_PATH, pluginName);
const PLUGIN_CONFIG = require(join(PLUGIN_PATH, 'webpack.config.js'));

// in the plugin's webpack config file, context defaults to process.cwd().
// we want to set it to the desired plugin directory
PLUGIN_CONFIG.context = PLUGIN_PATH;

PLUGIN_CONFIG.resolve = Object.assign({}, PLUGIN_CONFIG.resolve, {
	modules: [PLUGIN_PATH, 'node_modules']
});

const compiler = webpack(PLUGIN_CONFIG);

compiler.watch({
	context: PLUGIN_PATH
}, (err, stats) => {
	if (err) {
		throw err;
	}

	if (stats.hasErrors()) {
		console.log(chalk.red('Compilation failed'));
		stats.toJson('errors-only').errors.forEach(error => {
			console.log(error);
		});
		return;
	}

	console.log(chalk.green('Compiled successfully.'));
	console.log(`Copying ${pluginName}...`);

	copy(pluginName);
	console.log('Waiting...');
});
