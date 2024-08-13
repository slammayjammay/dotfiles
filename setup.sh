#!/bin/bash

# create $HOME/.config folder if it doesn't exist, copy relevant files over
[[ ! -d $HOME/.config ]] && mkdir $HOME/.config

echo -n "Copying 'ranger'..."
cp -r ./config/ranger $HOME/.config
echo "OK"

echo -n "Copying 'pipe-boy'..."
cp -r ./config/pipe-boy $HOME/.pipe-boy
echo "OK"

[[ ! -d $HOME/slammayjammay ]] && mkdir $HOME/slammayjammay
[[ ! -d $HOME/slammayjammay/pipe-boy ]] && git clone git@github.com:slammayjammay/pipe-boy $HOME/slammayjammay/pipe-boy

echo ""
echo "Don't forget:"
echo "- in \$HOME/.zshrc, source ./\$HOME/dotfiles/zsh/index.sh"
echo "- in \$HOME/.vim/vimrc, source ./\$HOME/dotfiles/vim/index.vim"
