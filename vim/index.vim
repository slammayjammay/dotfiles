source ~/dotfiles/vim/plugins.vim
source ~/dotfiles/vim/commands.vim
source ~/dotfiles/vim/keybindings.vim

" options
set backspace=indent,eol,start
set relativenumber!
set incsearch
set nowrap
set autoindent
set colorcolumn=80

" colors
syntax on
colorscheme slate
highlight String ctermfg=darkgreen
highlight Identifier ctermfg=blue
highlight IncSearch ctermbg=blue
highlight MatchParen ctermbg=blue
highlight ColorColumn ctermbg=darkgray
highlight Identifier ctermfg=blue
highlight es6InstanceMethod ctermfg=red
highlight es6InstanceMethodArgs ctermfg=white
