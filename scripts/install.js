const { homedir } = require('os');
const { execSync } = require('child_process');
const chalk = require('chalk');

// sub-scripts
const copyVim = require('./helpers/copy-vim');
const copyHyper = require('./helpers/copy-hyper');

copyVim();
console.log();

if (process.argv.includes('--build')) {
	copyHyper.installAll();
}
copyHyper.copyAll();
console.log();

console.log(chalk.bold.green('Installation successfull!'));
