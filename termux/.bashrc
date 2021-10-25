alias c="clear"

function remind() {
	message="$1"
	shift
	rest="$*"
	time="${rest/plus/+}"
	echo "termux-notification --content $message" | at $time
}

alias Remind=remind
alias go=remind
alias Go=remind

atd
