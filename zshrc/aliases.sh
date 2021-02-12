source "/Users/Scott/dotfiles/zshrc/git-aliases.sh"

# npm aliases
alias nr="npm run"
alias npmi="npm install"
alias publish="npm publish"

# other
alias tovim="xargs -o vim -p"
alias desktop="cd ~/Desktop"
alias subl="sublime"
alias ll="ls -alG"
alias say="say -v yuri"

get_cmd() {
	[[ -z ${aliases[$1]} ]] && echo "$1" || echo "$aliases[$1]"
}

function z() {
	cmd=$(get_cmd $1)
	stout=$(eval "$cmd $@[2,-1]")
	echo $stout
}
