# $EDITOR
export VISUAL="vim"
export EDITOR="sublime -w"

fpath=(~/dotfiles/zshrc/completion $fpath)
autoload -U compinit && compinit

source ~/dotfiles/zshrc/prompt.sh
source ~/dotfiles/zshrc/aliases.sh
source ~/dotfiles/zshrc/nvm.sh

[[ $(uname) == "Linux" ]] && source ~/dotfiles/linux/index.sh
