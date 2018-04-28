const { homedir } = require('os');
const { execSync } = require('child_process');
const { join } = require('path');
const { statSync, mkdirSync } = require('fs');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

module.exports = () => {
	const SOURCE = join(homedir(), 'dotfiles', 'vim/syntax');
	const DESTINATION = join(homedir(), '.vim/syntax');

	console.log(chalk.bold('Vim'));
	process.stdout.write(chalk('Copying vim files...'));

	mkdirp.sync(DESTINATION);

	// if (!statSync(DESTINATION).isDirectory()) {
	// 	mkdirSync(DESTINATION);
	// }

	execSync(`cp -r ${SOURCE}/* ${DESTINATION}`);
	console.log('done.');
};

