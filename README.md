# Dotfiles

There are really only two dotfile things here: `bash-profile` and `vim` (for now).
These are expected to be installed under `~/`.

The way to include them is to `source` them from the correct locations, i.e.:
```sh
# ---------- ~/.bash-profile ----------
source ~/dotfiles/bash-profile/index

# ---------- ~/.vim/vimrc ----------
source ~/dotfiles/vim/index
```

TODO: just copy these over, don't `source` them.

## Setup
Run `npm run setup` to copy all relevant files to the correct locations (with the exception of `~/.bash-profile` and `~/.vim/vimrc`). This will also build all local hyper plugins before copying them.

## Hyper
Hyper looks for a config file on load -- `~/.hyper.js`. That file exists in this project (`hyper/.hyper.js`) and is copied over when running `npm run setup`. The config file can take local hyper plugins and looks for them under `~/.hyper_plugins/local/`. Those local plugins are also in this project (`hyper/hyper_plugins/local/`) and are copied over on `npm run setup`.

### Plugin development
There is a watch script setup so that you can develop local plugins from the root of this folder. Run `node scripts/plugin-dev ${folder-of-plugin}` to setup the watch using `webpack` and copy the plugin on every compilation. There are also some npm scripts setup for shorthand: `npm run dev:typed` === `node scripts/plugin-dev hyper-typed-output`.