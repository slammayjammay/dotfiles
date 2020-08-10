# git aliases
alias gm="git merge"
alias push="git push"
alias pull="git pull"
alias gs="git status"
alias gb="git branch"
alias gc="git commit -m"
alias stash="git stash"
alias pop="git stash pop"
alias goma="git checkout master"
alias untracked="git ls-files -o --exclude-standard"
alias modified="git ls-files --modified"
alias conflicts="git diff --name-only --diff-filter U"

# npm aliases
alias nr="npm run"
alias npmi="npm install"
alias publish="npm publish"

# aliases for github packages
alias gd="git-diff-glob --pager"
alias gall="git-commit-all"
alias gl="git-log --pager"
alias goof="git-checkout-file"
alias ga="git-add-file"

# other
alias tovim="xargs -o vim -p"
alias desktop="cd ~/Desktop"
alias subl="sublime"
alias ll="ls -alG"

# alias for `git checkout`
function go() {
	local OPTARG OPTIND opt
	local doalias=false

	if [ $# -eq 0 ]; then
		return 1
	fi

	while getopts ':b' opt "$@"; do
		case ${opt} in
			b)
				doalias=true
				;;
		esac
	done

	if [ "$doalias" = true ]; then
		git checkout "$@"
	else
		git checkout `gb | grep "$1" -m 1`
	fi
}

get_cmd() {
	[[ -z ${aliases[$1]} ]] && echo "$1" || echo "$aliases[$1]"
}

function z() {
	cmd=$(get_cmd $1)
	stout=$(eval "$cmd $@[2,-1]")
}
