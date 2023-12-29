alias c="clear"
alias cget="termux-clipboard-get"
alias cset="termux-clipboard-set"
alias h="cd $HOME"
alias Remind="remind"
alias go="remind"
alias Go="remind"

function remind() {
	message="$1"
	shift
	rest="$*"
	time="${rest/plus/+}"
	echo "termux-notification --content $message" | at $time
}

function out() {
	rm $HOME/.bash_history
	exit
}

function gorilla() {
	cat "$HOME/storage/downloads/gorilla.json" | tr -d 'n' | termux-clipboard-set
}
