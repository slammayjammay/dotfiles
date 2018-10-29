const { EffectPass } = require('postprocessing');
const chalkEffects = require('./effects/chalk');

const effects = [
	...chalkEffects
];

module.exports = { pass: new EffectPass(null, ...effects) };
