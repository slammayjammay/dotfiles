alias nr="npm run"
alias nrs="npm run --silent"
alias npmi="npm install --ignore-scripts"
alias npmci="npm install --ignore-scripts"
alias publish="npm publish"
alias vi="vim"
alias tovi="xargs -o vim -p"
alias tovim="tovi"
alias dtop="cd $HOME/Desktop"
alias down="cd $HOME/Downloads"
alias me="cd $ME"
alias dot="cd $ME/dotfiles"
alias dno="cd $ME/dotfiles-node"
alias side="cd $ME/side"
alias ll="ls -alG"
alias f="ag -l"
alias ff="ag -g"
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

function start-ssh() {
	eval "$(ssh-agent -s)"
	ssh-add $HOME/.ssh/id_ed25519
}
