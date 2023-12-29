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
source ~/dotfiles/zshrc/nvm.sh

function condis() {
	xrandr | grep connected | grep disconnected -v -m 1 | awk '{print $1}'
}
function condisdp() {
	xrandr | grep connected | grep disconnected -v | grep -i dp | awk '{print $1}'
}
function condishdmi() {
	xrandr | grep connected | grep disconnected -v | grep -i hdmi | awk '{print $1}'
}
function bright() {
	brightness="${1:-1}"
	xrandr --output `condis` --brightness $brightness
}
function night() {
	brightness="${1:-0.7}"
	xrandr --output `condis` --brightness $brightness --gamma 0.9:0.75:0.6
}
function brightdp() {
	brightness="${1:-1}"
	xrandr --output `condisdp` --brightness $brightness
}
function nightdp() {
	brightness="${1:-0.7}"
	xrandr --output `condisdp` --brightness $brightness --gamma 0.9:0.75:0.6
}
