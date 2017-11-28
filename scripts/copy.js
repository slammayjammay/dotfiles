// ============================================================================
// Expects one or more local plugin directory names. If the flag "--build" is
// given, runs "npm run build" in the given directory before copying the entire
// directory to the correct location.
// ============================================================================

const { execSync } = require('child_process');
const HOME_DIRECTORY = execSync('cd ~ && pwd').toString().trim();
const {
	install,
	copy,
	copyHyperConfig
} = require('./helpers/copy-hyper')(HOME_DIRECTORY);

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
}
