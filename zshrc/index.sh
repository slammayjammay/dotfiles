# $EDITOR
export VISUAL="vim"
export EDITOR="sublime -w"

fpath=(~/dotfiles/zshrc/completion $fpath)
autoload -U compinit && compinit

source "/Users/Scott/dotfiles/zshrc/prompt.sh"
source "/Users/Scott/dotfiles/zshrc/aliases.sh"
source "/Users/Scott/dotfiles/zshrc/nvm.sh"
