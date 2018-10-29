const { resolve } = require('path');
const { readFileSync } = require('fs');
const { Effect } = require('postprocessing');

const spaceEffect = new Effect(
	'space',
	readFileSync(resolve(__dirname, '../../glsl/space-travel.glsl')).toString()
);

module.exports = [spaceEffect];
