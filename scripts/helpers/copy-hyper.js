const { homedir } = require('os');
const { execSync } = require('child_process');
const { join, basename } = require('path');
const { readdirSync, statSync } = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const SOURCE = join(homedir(), 'dotfiles', 'hyper');
const PLUGINS_BASE_PATH = join(SOURCE, 'hyper_plugins/local');
const CONFIG_DESTINATION = join(homedir(), '.hyper.js');
const PLUGINS_DESTINATION = join(homedir(), '.hyper_plugins/local');

function getPluginPaths() {
	return readdirSync(PLUGINS_BASE_PATH)
		.map(file => join(PLUGINS_BASE_PATH, file))
	// only directories
		.filter(file => statSync(file).isDirectory());
}

function installPlugin(path) {
	console.log();
	console.log(chalk.bold.green(`Installing plugin ${basename(path)}...`));

	const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

	execSync(
		`cd ${path} && ${npm} install && ${npm} run build -- --hide-modules --progress || true`,
		{ stdio: 'inherit' }
	);

	console.log();
}

function copyPlugin(path) {
	const pluginName = basename(path);
	process.stdout.write(chalk.bold(`Copying plugin ${pluginName}...`));

	const pluginDestination = join(`${PLUGINS_DESTINATION}/${pluginName}`);
	mkdirp.sync(pluginDestination);

	// files/directories to copy
	const distSource = join(path);
	const distDestination = join(pluginDestination, '');
	const packageSource = join(path, 'package.json');
	const packageDestination = join(pluginDestination)

	execSync(`cp -r ${distSource} ${distDestination}`, { stdio: 'inherit' });
	execSync(`cp -r ${packageSource} ${packageDestination}`, { stdio: 'inherit' });
	console.log('done.');
}

function copyHyperConfig() {
	console.log('Coyping hyper config file...');
	execSync(`cp ${join(SOURCE, '.hyper.js')} ${CONFIG_DESTINATION}`);
}

module.exports = {
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
		copyHyperConfig();
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

		copyPlugin(pluginPath);
	},

	copyHyperConfig() {
		copyHyperConfig();
	}
};
