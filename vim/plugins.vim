" vim-plug
call plug#begin('~/.vim/autoload')
Plug 'https://github.com/scrooloose/nerdtree'
Plug 'jiangmiao/auto-pairs'
Plug 'airblade/vim-gitgutter'
Plug 'editorconfig/editorconfig-vim'
Plug 'othree/html5.vim'
Plug 'tpope/vim-surround'
Plug 'vim-syntastic/syntastic'
Plug 'https://github.com/vim-scripts/SyntaxAttr.vim'
Plug 'posva/vim-vue'
call plug#end()

" ctrlp options
set runtimepath^=~/.vim/bundle/ctrlp.vim
set wildignore+=*/.git/*
set wildignore+=*/node_modules/*
set wildignore+=*/.svn/*
let g:ctrlp_show_hidden = 1
let g:ctrlp_dont_split = 'NERD'
let g:ctrlp_working_path_mode = 'c'

" NERDTree options
let g:NERDTreeShowLineNumbers=1
let g:NERDTreeShowHidden=1
let g:NERDTreeIgnore = ['\.DS_Store$', '\.swp$']

" Syntastic options
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_sass_checkers = ['sass']
let g:syntastic_scss_checkers = ['sass']
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
