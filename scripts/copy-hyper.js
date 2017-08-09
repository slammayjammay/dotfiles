const { execSync } = require('child_process');
const { join, basename } = require('path');
const { readdirSync, statSync } = require('fs');
const chalk = require('chalk');

module.exports = (homeDirectory) => {
	const SOURCE = join(homeDirectory, 'dotfiles', 'hyper/hyper_plugins/local');
	const DESTINATION = join(homeDirectory, '.hyper_plugins/local');

	function getPluginPaths() {
		return readdirSync(SOURCE).map(file => join(SOURCE, file)).filter(file => {
			return statSync(file).isDirectory(); // only directories
		});
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

		execSync(`cp -r ${path} ${DESTINATION}`, { stdio: 'inherit' });
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
