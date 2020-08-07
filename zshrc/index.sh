# $EDITOR
export VISUAL="vim"
export EDITOR="sublime -w"

source "/Users/Scott/dotfiles/zshrc/prompt.sh"
source "/Users/Scott/dotfiles/zshrc/aliases.sh"
source "/Users/Scott/dotfiles/zshrc/nvm.sh"

function gitboy() {
	check_if_git_repo=$(git rev-parse --is-inside-work-tree)

	if [ $? != 0 ]; then
		printf "$check_if_git_repo"
		return 1;
	fi

	modified_files=`git diff --name-only --relative --diff-filter M`
	pipe-boy "$modified_files" --banner.text GitBoy --banner.font reverse --banner.horizontalLayout "controlled smushing"
}
