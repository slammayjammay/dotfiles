bindkey -v
setopt interactive_comments

fpath=($ME/dotfiles/shell/completion $fpath)
autoload -U compinit && compinit
echo -ne '\e[1 q'
