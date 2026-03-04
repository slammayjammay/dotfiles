bindkey -v
setopt interactive_comments

fpath=($ME/dotfiles/shell/completion $fpath)
autoload -U compinit && compinit
