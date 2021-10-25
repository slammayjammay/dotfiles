# $EDITOR
export VISUAL="vim"
export EDITOR="vim"
export LESS="-Rc"

bindkey -v

fpath=(~/dotfiles/zshrc/completion $fpath)
autoload -U compinit && compinit

source ~/dotfiles/zshrc/prompt.sh
source ~/dotfiles/zshrc/aliases.sh
source ~/dotfiles/zshrc/nvm.sh

function bright() {
	brightness="${1:-1}"
	xrandr --output `xrandr | grep connected | grep disconnected -v | awk '{print $1}'` --brightness $brightness
}
function night() {
	brightness="${1:-0.7}"
	xrandr --output `xrandr | grep connected | grep disconnected -v | awk '{print $1}'` --brightness $brightness --gamma 0.9:0.75:0.6
}
