const nasaCurvedMonitor = require('./effects/nasa-curved-monitor');

module.exports = ({ ShaderMaterial }) => {
	return nasaCurvedMonitor({ ShaderMaterial });
};
