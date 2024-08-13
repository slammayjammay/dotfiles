# Need to manually copy this for changes to take effect

# Enter any custom functions here

# Ex: alias `pipe-boy --help` as `pipeboyhelp`
function help() {
	pipe-boy --help
}

function git() {
	/usr/bin/git -c color.ui=always $@
}

function gd() {
	git diff $@
}

function gdm() {
	git diff master $@
}

function gdmr() {
	git diff master --name-only --relative
}

function gs() {
	git status $@
}

function gsp() {
	git status --porcelain
}
