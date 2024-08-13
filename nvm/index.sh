export NODE_VERSION_JANK="18.17.0"
alias nvm="$HOME/dotfiles/nvm/nvm.sh $@"

function node() {
	$HOME/.nvm/versions/node/v$NODE_VERSION_JANK/bin/node $@
}

function nuse() {
	NODE_VERSION_JANK=$1
}
