# $EDITOR
export VISUAL="vim"
export EDITOR="vim"
export LESS="-Rci"

bindkey -v
setopt interactive_comments

fpath=(~/dotfiles/zshrc/completion $fpath)
autoload -U compinit && compinit

source ~/dotfiles/zshrc/prompt.sh
source ~/dotfiles/zshrc/aliases.sh
source ~/dotfiles/zshrc/git-aliases.sh
source ~/dotfiles/nvm/index.sh
