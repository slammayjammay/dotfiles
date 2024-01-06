alias c="clear"
alias cget="termux-clipboard-get"
alias cset="termux-clipboard-set"
alias h="$HOME"
alias hh="cd $HOME"
alias Remind="remind"
alias go="remind"
alias Go="remind"
alias ll="ls -al"

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
