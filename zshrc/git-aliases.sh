alias gl="git log"
alias ga="git add"
alias gm="git merge"
alias gs="git status"
alias gb="git branch"
alias gc="git commit -m"
alias go="git checkout"
alias gd="git diff"
alias gdn="git --no-pager diff --name-status"
alias gsp="git status --porcelain"
alias gsd="git status --porcelain | awk '{ print \$2 }' | grep -i $1"
alias push="git push"
alias pushu="git push -u origin HEAD"
alias pull="git pull"
alias stash="git stash"
alias pop="git stash pop"
alias reset="git reset HEAD^ && git reset ."
alias prune="git remote prune origin"
alias goma="git checkout master"
alias gall="git add -A; git commit -m"
alias gmod="git status --porcelain | awk '{ if (\$1 == \"M\") print \$2 }'"
alias gun="git ls-files -o --exclude-standard"
alias conflicts="git diff --name-only --diff-filter U"

function ggd() {
	git diff $(gmod | grep -i $1)
}

function gga() {
	git add `git status --porcelain | awk '{ print $2 }' | grep -i $1`
	git status
}

function ggo() {
	git checkout `gmod | grep -i $1`
}

function ggb() {
	git checkout `gb | grep -i $1`
}

function gitboy() {
	is_git_repo=$(git rev-parse --is-inside-work-tree)

	if [ $? != 0 ]; then
		printf "$is_git_repo"
		return 1;
	fi

	modified_files=`git diff --name-status --relative --diff-filter M | awk '{ print $2 }'`
	pipe-boy "$modified_files" --banner.text GitBoy --banner.font Reverse --banner.horizontalLayout "controlled smushing"
}

function start-ssh() {
	eval "$(ssh-agent -s)"
	ssh-add $HOME/.ssh/id_ed25519
}
