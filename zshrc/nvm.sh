export PATH="~/.nvm/versions/node/v12.18.2/bin:$PATH"

is_nvm_loaded=false

function nvm() {
	if [ "$is_nvm_loaded" = false ]; then
		source ~/.nvm/nvm.sh
	fi

	nvm "$@"
}
