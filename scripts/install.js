const { execSync } = require('child_process');
const chalk = require('chalk');

const HOME_DIRECTORY = execSync('cd ~ && pwd').toString().trim();

// sub-scripts
const copyVim = require('./helpers/copy-vim');
const copyHyper = require('./helpers/copy-hyper')(HOME_DIRECTORY);

copyVim(HOME_DIRECTORY);
console.log();

copyHyper.installAll();
copyHyper.copyAll();
console.log();

console.log(chalk.bold.green('Installation successfull!'));
