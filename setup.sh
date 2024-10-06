#!/bin/bash

[[ ! -d $HOME/.config ]] && mkdir $HOME/.config

echo -n "Copying 'ranger'..."
cp -r ./config/ranger $HOME/.config
echo "OK"

echo -n "Copying 'pipe-boy'..."
cp -r ./config/pipe-boy $HOME/.pipe-boy
echo "OK"

echo -n "Copying '.gitconfig'..."
cp -r ./config/.gitconfig $HOME/.gitconfig
echo "OK"

echo -n "Copying '.gitignore'..."
cp -r ./config/.gitignore $HOME/.gitignore
echo "OK"

echo -n "Copying '.editorconfig'..."
cp -r ./config/.editorconfig $HOME/.editorconfig
echo "OK"

[[ ! -d $ME/dotfiles-node ]] && mkdir $ME/dotfiles-node
[[ ! -d $ME/dotfiles-node/pipe-boy ]] && git clone git@github.com:slammayjammay/pipe-boy $ME/dotfiles-node/pipe-boy

echo ""
echo "Don't forget:"
echo "- in \$HOME/.zshrc, source \$ME/dotfiles/zsh/index.sh"
echo "- in \$HOME/.vim/vimrc, source \$ME/dotfiles/vim/index.vim"
