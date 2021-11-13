const { resolve } = require('path');
const PATH = '../hyper_plugins/local/hyper-postprocessing/examples/';
const fn = require(resolve(__dirname, PATH, 'effects/retro'));
module.exports = (...args) => fn(...args);
