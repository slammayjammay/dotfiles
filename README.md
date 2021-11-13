# Dotfiles
Expects to clone inside `$HOME` or `~` directory.

## Source these:
```sh
# ~/.zshrc
source ~/dotfiles/zsh/index.sh

# ~/.vim/vimrc
source ~/dotfiles/vim/index.vim
```

## Copy these:
```sh
# pipe-boy
cp -r ~/dotfiles/misc/pipe-boy ~/.pipe-boy

# ranger
cp ~/dotfiles/misc/ranger/rc.conf ~/.config/ranger/
```

## Zsh
Install through brew, apt, pacman, etc. Then run below, log out, log in.
```sh
chsh -s `which zsh` $YOUR_USERNAME
```

## VimPlug
Follow directions in the [VimPlug repo](https://github.com/junegunn/vim-plug): create file `~/.vim/autoload/plug.vim` and set contents to [this](https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim). Open vim and run `:PlugInstall`.
