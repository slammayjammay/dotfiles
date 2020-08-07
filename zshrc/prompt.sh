# https://stackoverflow.com/questions/2657935/checking-for-a-dirty-index-or-untracked-files-with-git
function evil_git_dirty() {
	[[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] && echo "*"
}

function git_prompt() {
	branch=$(git rev-parse --abbrev-ref HEAD) &> /dev/null

	if [[ $? -eq 0 ]]; then
		echo " %F{green}($branch)%{$reset_color%}%F{red}$(evil_git_dirty)%{$reset_color%} "
	else
		echo " "
	fi
}

setopt PROMPT_SUBST
autoload colors && colors
PROMPT='%1d %j$(git_prompt)\$ '
