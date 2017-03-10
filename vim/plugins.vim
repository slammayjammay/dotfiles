" vim-plug
call plug#begin('~/.vim/autoload')
Plug 'https://github.com/scrooloose/nerdtree'
Plug 'jiangmiao/auto-pairs'
Plug 'airblade/vim-gitgutter'
Plug 'editorconfig/editorconfig-vim'
Plug 'othree/html5.vim'
Plug 'tpope/vim-surround'
call plug#end()

" ctrlp options
set runtimepath^=~/.vim/bundle/ctrlp.vim
set wildignore+=*/.git/*
set wildignore+=*/node_modules/*
set wildignore+=*/.svn/*
let g:ctrlp_show_hidden = 1
let g:ctrlp_dont_split = 'NERD'

" NERDTree options
let g:NERDTreeShowLineNumbers=1
let g:NERDTreeShowHidden=1
