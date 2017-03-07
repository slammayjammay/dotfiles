if [ ! -d ~/.vim/syntax ]; then
  mkdir ~/.vim/syntax
fi

cp -r ~/dotfiles/vim/syntax/ ~/.vim/syntax
