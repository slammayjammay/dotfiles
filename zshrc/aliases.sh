alias nr="npm run"
alias nrs="npm run --silent"
alias npmi="npm install"
alias publish="npm publish"
alias vi="vim"
alias tovi="xargs -o vim -p"
alias tovim="tovi"
alias dtop="cd $HOME/Desktop"
alias dtop="cd $HOME/Downloads"
alias me="cd $ME"
alias dot="cd $ME/dotfiles"
alias dno="cd $ME/dotfiles-node"
alias side="cd $ME/side"
alias ll="ls -alG"
alias f="ag -l"
alias ff="ag -g"
alias -g g="| grep -i"
alias -g ak="| _ak"
alias -g v="| xargs -o vim -p"
alias -g iv="| vipe"
alias -g ivs="| vipe | { eval \"\$(cat -)\" }"
alias -g l="| less -Rf"
alias -g xx="| xargs "
alias pipe-boy="$ME/dotfiles-node/pipe-boy/bin/pipe-boy.js"
alias clipr="$ME/dotfiles-node/clipr/clipr.js"
alias xg="$ME/dotfiles-node/clipr/clipr.js get"
alias xp="$ME/dotfiles-node/clipr/clipr.js post"

function _ak() {
	while read -r line; do
		echo $line | awk "{ if (\$1 == \"$1\") print \$${2-2} }";
	done
}

function -nvm() {
	unsetopt aliases
	source ~/.nvm/nvm.sh
	setopt aliases
}

function -rvm() {
	unsetopt aliases
	source ~/.rvm/scripts/rvm
	setopt aliases
}
