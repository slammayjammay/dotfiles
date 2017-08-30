const { execSync } = require('child_process');
const { join } = require('path');
const { statSync, mkdirSync } = require('fs');
const chalk = require('chalk');

module.exports = (homeDirectory) => {
	const SOURCE = join(homeDirectory, 'dotfiles', 'vim/syntax');
	const DESTINATION = join(homeDirectory, '.vim/syntax');

	console.log(chalk.bold('Vim'));
	process.stdout.write(chalk('Copying vim files...'));

	if (!statSync(DESTINATION).isDirectory()) {
		mkdirSync(DESTINATION);
	}

	execSync(`cp -r ${SOURCE}/* ${DESTINATION}`);
	console.log('done.');
};

