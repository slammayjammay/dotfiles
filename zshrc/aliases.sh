source ~/dotfiles/zshrc/git-aliases.sh

# npm aliases
alias nr="npm run"
alias npmi="npm install"
alias publish="npm publish"

# other
alias vi="vim"
alias tovi="xargs -o vim -p"
alias tovim="tovi"
alias desktop="cd ~/Desktop"
alias ll="ls -alG"
alias say="say -v yuri"

get_cmd() {
	[[ -z ${aliases[$1]} ]] && echo "$1" || echo "$aliases[$1]"
}

function z() {
	cmd=$(get_cmd $1)
	vim -c "set noro" <(eval "$cmd $@[2,-1]")
}

function zz() {
	cmd=$(get_cmd $1)
	stout=$(eval "$cmd $@[2,-1]")
	echo $stout
}
