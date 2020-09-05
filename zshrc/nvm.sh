export PATH="/Users/Scott/.nvm/versions/node/v12.18.2/bin:$PATH"

is_nvm_loaded=false

function nvm() {
	if [ "$is_nvm_loaded" = false ]; then
		. "/Users/Scott/.nvm/nvm.sh"
	fi

	nvm "$@"
}
