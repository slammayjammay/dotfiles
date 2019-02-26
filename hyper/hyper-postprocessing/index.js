const { resolve } = require('path');
const { readFileSync } = require('fs');
const { Uniform, LinearFilter, TextureLoader } = require('three');
const { EffectPass, Effect, BloomEffect } = require('postprocessing');

const PATH = '../hyper_plugins/local/hyper-postprocessing/examples/';

const passes = [];

passes.push(new EffectPass(null,
	new Effect(
		'scale',
		readFileSync(resolve(__dirname, PATH, 'glsl/scale.glsl')).toString(),
		{ defines: new Map([['scale', '0.95']]) }
	),
	new Effect(
		'sampling',
		readFileSync(resolve(__dirname, PATH, 'glsl/sampling.glsl')).toString(),
		{ blendFunction: 12 }
	)
));

passes.push(new EffectPass(null,
	new BloomEffect({
		kernelSize: 3,
		distinction: -0.4
	}))
);

module.exports = passes.map(pass => {
	return { pass };
});
