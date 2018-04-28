// ============================================================================
// Expects one or more local plugin directory names. If the flag "--build" is
// given, runs "npm run build" in the given directory before copying the entire
// directory to the correct location.
// ============================================================================

const { homedir } = require('os');
const { execSync } = require('child_process');
const {
	install,
	copy,
	copyHyperConfig
} = require('./helpers/copy-hyper');

const SHOULD_BUILD = process.argv.includes('--build');
const SHOULD_COPY_CONFIG = process.argv.includes('--copy-config');

let plugins = process.argv.slice(2).filter(plugin => {
	return !['--build', '--copy-config'].includes(plugin);
});

plugins.forEach(plugin => {
	if (SHOULD_BUILD) {
		install(plugin);
	}

	copy(plugin);
});

if (SHOULD_COPY_CONFIG) {
	copyHyperConfig();
	console.log('done');
}
