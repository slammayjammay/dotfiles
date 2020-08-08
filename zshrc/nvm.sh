export PATH="/Users/Scott/.nvm/versions/node/v8.9.4/bin:$PATH"

is_nvm_loaded=false

function nvm() {
	if [ "$is_nvm_loaded" = false ]; then
		. "/Users/Scott/.nvm/nvm.sh"
	fi

	nvm "$@"
}
