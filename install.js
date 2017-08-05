const { spawnSync, execSync } = require('child_process');
const { resolve, join } = require('path');
const { existsSync, readdirSync } = require('fs');
const chalk = require('chalk');

const HOME_DIR = execSync('cd ~ && pwd').toString().trim();

// vim
output(chalk.bold('vim'));
if (!existsSync(join(HOME_DIR, '.vim/syntax'))) {
	runChild(`cd ${HOME_DIR} && mkdir -p .vim/syntax`);
	output('Created directory ~/.vim/syntax');
}
runChild(`cp -r ${resolve('vim/syntax')}/* ${join(HOME_DIR, '.vim/syntax')}`);
output('Copied vim syntax files.');

output();

// hyper
output(chalk.bold('hyper'));
const pluginsBase = resolve('./hyper/hyper_plugins/local');
const pluginsPaths = readdirSync(pluginsBase);
pluginsPaths.forEach(pluginDir => {
	output(`Installing plugin ${pluginDir}...`);
	runChild(`cd ${join(pluginsBase, pluginDir)} && npm install && npm run build -- --hide-modules --progress`);
});

output();
runChild(`cp -r ${pluginsBase}/* ${join(HOME_DIR, '.hyper_plugins/local/')}`)
output('Copied hyper plugins.');

runChild(`cp ${resolve('./hyper/.hyper.js')} ${HOME_DIR}`);
output('Copied hyper config file.');

output();

function runChild(command) {
	execSync(command, { stdio: 'inherit' });
}

function output(string= '') {
	console.log(string);
}
