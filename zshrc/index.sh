export VISUAL="vim"
export EDITOR="vim"
export LESS="-Rci"

bindkey -v
setopt interactive_comments

fpath=($ME/dotfiles/zshrc/completion $fpath)
autoload -U compinit && compinit

source $ME/dotfiles/zshrc/prompt.sh
source $ME/dotfiles/zshrc/aliases.sh
source $ME/dotfiles/zshrc/git-aliases.sh
