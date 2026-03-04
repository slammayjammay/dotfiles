export VISUAL="vim"
export EDITOR="vim"
export LESS="-Rci"

bindkey -v
setopt interactive_comments

fpath=($ME/dotfiles/shell/completion $fpath)
autoload -U compinit && compinit

source $ME/dotfiles/shell/prompt.sh
source $ME/dotfiles/shell/aliases.sh
source $ME/dotfiles/shell/git-aliases.sh
