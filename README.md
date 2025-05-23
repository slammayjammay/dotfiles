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

## Node and NVM

Follow NVM installation instructions from the
[repo](https://github.com/nvm-sh/nvm). [nvm/index.sh](nvm/index.sh) gets around
the load times and errors due to custom aliases. If `node` or `npm` is not
defined on the system, it may be necessary to create simlinks:

```sh
sudo ln -s `whichnode` /usr/bin
sudo ln -s `whichnpm` /usr/bin
```
