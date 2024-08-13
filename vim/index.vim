source ~/dotfiles/vim/plugins.vim
source ~/dotfiles/vim/commands.vim
source ~/dotfiles/vim/keybindings.vim

if has('linux')
        source ~/dotfiles/vim/keybindings-linux.vim
endif

if has('python3')
        silent! python3 1
endif

" options
set tabstop=2
set backspace=indent,eol,start
set relativenumber!
set number
set incsearch
set nowrap
set autoindent
set colorcolumn=80
set splitright
set expandtab
set tabpagemax=40
set hidden
set shortmess=a
set ignorecase
set smartcase

" colors
syntax on
colorscheme synthwave
" set `.inc` syntax to html
au BufRead *.inc set ft=html
au BufRead *.hbs set ft=html
au BufRead *.ejs set ft=html
