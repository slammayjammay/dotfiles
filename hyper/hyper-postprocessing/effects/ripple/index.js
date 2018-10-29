const { resolve } = require('path');
const { readFileSync } = require('fs');
const { TextureLoader, LinearFilter, Uniform } = require('three');
const { Effect } = require('postprocessing');

const effects = [];

const backgroundEffect = new Effect(
	'backgroundImage',
	readFileSync(resolve(__dirname, '../../glsl/background-image.glsl')).toString(),
	{
		uniforms: new Map([['backgroundImage', new Uniform(null)]])
	}
);
new TextureLoader().load(resolve(__dirname, '../../images/underwater.jpg'), texture => {
	texture.minFilter = LinearFilter;
	backgroundEffect.uniforms.get('backgroundImage').value = texture;
});
effects.push(backgroundEffect);

effects.push(new Effect(
	'underwaterEffect',
	readFileSync(resolve(__dirname, '../../glsl/ripple.glsl')).toString()
));

effects.push(new Effect(
	'scaleEffect',
	readFileSync(resolve(__dirname, '../../glsl/scale.glsl')).toString(),
	{
		defines: new Map([['scale', '0.9']])
	}
));

effects.push(new Effect(
	'sampling',
	readFileSync(resolve(__dirname, '../../glsl/sampling.glsl')).toString(),
	{
		blendFunction: 12
	}
));

module.exports = effects;
