alias nr="npm run"
alias npmi="npm install"
alias publish="npm publish"
alias vi="vim"
alias tovi="xargs -o vim -p"
alias tovim="tovi"
alias dtop="cd $HOME/Desktop"
alias me="cd $ME"
alias dot="cd $ME/dotfiles"
alias dno="cd $ME/dotfiles-node"
alias side="cd $ME/side"
alias ll="ls -alG"
alias f="ag -l"
alias ff="ag -g"
alias -g g="| grep -i"
alias -g awk1="| awk '{ print \$1 }'"
alias -g awk2="| awk '{ print \$2 }'"
alias -g v="| xargs -o vim -p"
alias -g zz="| vim -"
alias -g l="| less -Rf"
alias -g xx="| xargs "
alias pipe-boy="$ME/dotfiles-node/pipe-boy/bin/pipe-boy.js"

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
