const { resolve } = require('path');
const { readFileSync } = require('fs');
const { Effect } = require('postprocessing');

const filmEffect = new Effect(
	'filmEffect',
	readFileSync(resolve(__dirname, '../../glsl/film.glsl')).toString(),
	{
		blendFunction: 12 // normal -- overwrite
	}
);

module.exports = [filmEffect];
