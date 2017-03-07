# Dotfiles

There are really only two dotfile things here: `bash-profile` and `vim` (for now).

These are expected to be installed under `~/`.

The way to include them is to `source` them from the correct locations, .i.e:
```sh
# ---------- ~/.bash-profile ----------
source ~/dotfiles/bash-profile/index

# ---------- ~/.vim/vimrc ----------
source ~/dotfiles/vim/index
```

This is probably a crappy way to do this so once it becomes a headache I'll think about fixing it.

## Vim
Vim decided that `source`-ing syntax wouldn't do at all. It must be placed under `~/.vim/syntax` for it to actually get loaded. So after every `pull`, run `make-vim-work.sh` to copy the contents of `~/dotfiles/vim/syntax/*` into `~/.vim/syntax`.
