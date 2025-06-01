# Dotfiles

First set the `$ME` env var to point to the this repo's containing directory.

Then source both these:

- in `$HOME/.zshrc`, source `$ME/dotfiles/zshrc/index.sh`
- in `$HOME/.vim/vimrc`, source `$ME/dotfiles/vim/index.vim`

Lastly run `setup.sh` script.

## ZSH

Install `zsh`, then run below, log out, log in. Reboot if shell is still bash.

```sh
chsh -s `which zsh` $YOUR_USERNAME
```

## VimPlug

Follow directions in the [VimPlug repo](https://github.com/junegunn/vim-plug):
create file `~/.vim/autoload/plug.vim` and set contents to
[this](https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim).
Open vim and run `:PlugInstall`.

## NVM+RVM

- [nvm installation](https://github.com/nvm-sh/nvm)
- [rvm installation](https://rvm.io/)

## Node+Ruby paths

`nvm` and `rvm` are not loaded on shell init due to slow load times. Commands
to load these are defined in `zshrc/aliases.sh`: `-nvm` and `-rvm`.

Create symlinks to allow use of these without loading, if not already installed
on system:

```sh
$ -nvm
$ -rvm
$ sudo ln -s `which node` /usr/bin
$ sudo ln -s `which npm` /usr/bin
$ sudo ln -s `which ruby` /usr/bin
```
