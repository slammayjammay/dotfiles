alias gl="git log"
alias gm="git merge"
alias push="git push"
alias pull="git pull"
alias gs="git status"
alias gb="git branch"
alias gc="git commit -m"
alias stash="git stash"
alias pop="git stash pop"
alias goma="git checkout master"
alias gall="git add -A; git commit -m"
alias modified="git ls-files --modified"
alias untracked="git ls-files -o --exclude-standard"
alias conflicts="git diff --name-only --diff-filter U"

function git_status_files() {
	git status --porcelain | awk '{ print $2 }'
}

function gd() {
	if [[ -z $1 ]]; then
		git diff "$@"
	else
		git -c color.ui=always diff `git_status_files | grep $1` | less -R
	fi
}

function ga() {
	git add `git_status_files | grep $1`
	git status
}

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
		git checkout `gb -r | grep "$1" -m 1`
	fi
}

function goof() {
	git checkout `git_status_files | grep $1`
}

function pipe-boy() {
	node_version=$(node -v)
	needs_swap=false; [ "$node_version" != "v8.9.4" ] && needs_swap=true

	$needs_swap && nvm use 8.9.4 &> /dev/null
	npx pipe-boy "$@"
	$needs_swap && nvm use $node_version &> /dev/null
}

function gitboy() {
	is_git_repo=$(git rev-parse --is-inside-work-tree)

	if [ $? != 0 ]; then
		printf "$is_git_repo"
		return 1;
	fi

	modified_files=`git diff --name-only --relative --diff-filter M`
	pipe-boy "$modified_files" --banner.text GitBoy --banner.font reverse --banner.horizontalLayout "controlled smushing"
}