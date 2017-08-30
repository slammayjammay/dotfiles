// ============================================================================
// Expects one or more local plugin directory names. If the flag "--build" is 
// given, runs "npm run build" in the given directory before copying the entire
// directory to the correct location.
// ============================================================================

const { execSync } = require('child_process');
const HOME_DIRECTORY = execSync('cd ~ && pwd').toString().trim();
const { install, copy } = require('./helpers/copy-hyper')(HOME_DIRECTORY);

const SHOULD_BUILD = process.argv.includes('--build');

let plugins = process.argv.slice(2);
if (SHOULD_BUILD) {
	plugins = plugins.filter(plugin => plugin !== '--build');
}

plugins.forEach(plugin => {
	if (SHOULD_BUILD) {
		install(plugin);
	}

	copy(plugin);
});

