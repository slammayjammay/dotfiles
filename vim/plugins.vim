" vim-plug
call plug#begin('$HOME/.vim/autoload')
Plug 'https://github.com/scrooloose/nerdtree'
Plug 'jiangmiao/auto-pairs'
Plug 'https://github.com/airblade/vim-gitgutter'
Plug 'https://github.com/editorconfig/editorconfig-vim'
Plug 'https://github.com/othree/html5.vim'
Plug 'https://github.com/tpope/vim-surround'
" Plug 'https://github.com/vim-syntastic/syntastic'
Plug 'https://github.com/vim-scripts/SyntaxAttr.vim'
" Plug 'https://github.com/leafOfTree/vim-vue-plugin'
Plug 'https://github.com/francoiscabrol/ranger.vim'
Plug 'https://github.com/MaxMEllon/vim-jsx-pretty'
Plug 'https://github.com/ctrlpvim/ctrlp.vim'
Plug 'https://github.com/mg979/vim-visual-multi'
" Plug 'https://github.com/instant-markdown/vim-instant-markdown', {'for': 'markdown'}
Plug 'https://github.com/TroyFletcher/vim-colors-synthwave'
call plug#end()

" ctrlp options
let g:ctrlp_custom_ignore = 'node_modules\|\.git\|\.next'
let g:ctrlp_show_hidden = 1
let g:ctrlp_dont_split = 'NERD'
let g:ctrlp_working_path_mode = 0

" NERDTree options
let g:NERDTreeShowLineNumbers=1
let g:NERDTreeShowHidden=1
let g:NERDTreeIgnore = ['\.DS_Store$', '\.swp$']

" Syntastic options
" let g:syntastic_javascript_checkers = ['eslint']
" let g:syntastic_sass_checkers = ['sass']
" let g:syntastic_scss_checkers = ['sass']
" let g:syntastic_check_on_open = 1
" let g:syntastic_check_on_wq = 0

" Instant Markdown options
" let g:instant_markdown_autostart = 0
