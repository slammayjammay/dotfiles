# Dotfiles

Expects to clone inside `$HOME` directory. Run `setup.sh` script.

## Zsh

Install `zsh`, then run below, log out, log in.

```sh
chsh -s `which zsh` $YOUR_USERNAME
```

## VimPlug
Follow directions in the [VimPlug repo](https://github.com/junegunn/vim-plug):
create file `~/.vim/autoload/plug.vim` and set contents to
[this](https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim).
Open vim and run `:PlugInstall`.
