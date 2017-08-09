const { execSync } = require('child_process');
const { join, basename } = require('path');
const { readdirSync, statSync } = require('fs');
const chalk = require('chalk');

module.exports = (homeDirectory) => {
	const SOURCE = join(homeDirectory, 'dotfiles', 'hyper');
	const PLUGINS_BASE_PATH = join(SOURCE, 'hyper_plugins/local');
	const CONFIG_DESTINATION = join(homeDirectory, '.hyper.js');
	const PLUGINS_DESTINATION = join(homeDirectory, '.hyper_plugins/local');

	function getPluginPaths() {
		return readdirSync(PLUGINS_BASE_PATH)
			.map(file => join(PLUGINS_BASE_PATH, file))
			// only directories
			.filter(file => statSync(file).isDirectory());
	}

	function installPlugin(path) {
		console.log();
		console.log(chalk.bold.green(`Installing plugin ${basename(path)}...`));

		execSync(
			`cd ${path} && npm install && npm run build -- --hide-modules --progress`, 
			{ stdio: 'inherit' }
		);

		console.log();
	}

	function copyPlugin(path) {
		process.stdout.write(chalk.bold(`Copying plugin ${basename(path)}...`));

		execSync(`cp -r ${path} ${PLUGINS_DESTINATION}`, { stdio: 'inherit' });
		console.log('done.');
	}

	return {
		installAll() {
			console.log(chalk.bold('Hyper'));

			const pluginPaths = getPluginPaths();
			pluginPaths.forEach(path => {
				installPlugin(path);
			});
		},

		copyAll() {
			const pluginPaths = getPluginPaths();
			pluginPaths.forEach(path => {
				copyPlugin(path);
			});

			// also copy hyper config file
			process.stdout.write('Coyping hyper config file...');
			execSync(`cp ${join(SOURCE, '.hyper.js')} ${CONFIG_DESTINATION}`);
			console.log('done.');
		},

		install(pluginName) {
			const pluginPath = getPluginPaths().find(path => {
				return basename(path) === pluginName;
			});

			if (!pluginPath) {
				throw new Error(`No plugin by the name of ${pluginName}`);
			}

			installPlugin(pluginPath);
		},

		copy(pluginName) {
			const pluginPath = getPluginPaths().find(path => {
				return basename(path) === pluginName;
			});

			if (!pluginPath) {
				throw new Error(`No plugin by the name of ${pluginName}`);
			}

			installPlugin(pluginPath);
		}
	};
};
