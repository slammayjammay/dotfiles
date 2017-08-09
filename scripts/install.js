const { spawnSync, execSync } = require('child_process');
const { resolve, join } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');
const chalk = require('chalk');

const HOME_DIRECTORY = execSync('cd ~ && pwd').toString().trim();

// sub-scripts
const copyVim = require('./copy-vim');
const copyHyper = require('./copy-hyper')(HOME_DIRECTORY);

copyVim(HOME_DIRECTORY);
console.log();

copyHyper.installAll();
copyHyper.copyAll();
console.log();

console.log(chalk.bold.green('Installation successfull!'));
