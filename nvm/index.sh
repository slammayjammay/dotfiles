export NODE_VERSION_JANK="20.18.0"
alias nvm="$ME/dotfiles/nvm/nvm.sh $@"

function node() {
	$HOME/.nvm/versions/node/v$NODE_VERSION_JANK/bin/node $@
}

function npm() {
	$HOME/.nvm/versions/node/v$NODE_VERSION_JANK/bin/npm $@
}

function whichnode() {
	echo $HOME/.nvm/versions/node/v$NODE_VERSION_JANK/bin/node
}

function nuse() {
	NODE_VERSION_JANK=$1
}

function nuserc() {
	nuse `cat .nvmrc`
}
