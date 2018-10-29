const { resolve } = require('path');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter, Uniform } = require('three');
const { Effect } = require('postprocessing');

const chalkEffect = new Effect(
	'chalkEffect',
	readFileSync(resolve(__dirname, '../../glsl/chalk.glsl')).toString(),
	{
		attributes: 2,
		uniforms: new Map([['noiseTexture', new Uniform(null)]])
	}
);

new TextureLoader().load(resolve(__dirname, '../../images/noise.png'), texture => {
	texture.minFilter = LinearFilter;
	chalkEffect.uniforms.get('noiseTexture').value = texture;
});

module.exports = [chalkEffect];
