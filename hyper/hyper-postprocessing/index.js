// const nasaCurvedMonitor = require('./effects/nasa-curved-monitor');
const glitch = require('./effects/glitch');

module.exports = ({ ShaderMaterial }) => {
	// return nasaCurvedMonitor({ ShaderMaterial });
	return glitch({ ShaderMaterial });
};
