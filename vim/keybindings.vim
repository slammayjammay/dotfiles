" newlines
imap <C-]> <esc>O
imap <C-\> <esc>o

" tabbing
nnoremap <C-j> :tabprevious<CR>
nnoremap <C-S-l> :tabnext<CR>
nnoremap <C-t> :tabnew<CR>:e .<CR>
nnoremap ∆ :tabprevious<CR>
nnoremap ¬ :tabnext<CR>
nnoremap <leader>z :filetype detect<CR>
inoremap <C-j> <esc>:tabprevious<CR>
inoremap <C-S-l> <esc>:tabnext<CR>
inoremap <C-t> <esc>:tabnew<CR>:e .<CR>
inoremap ∆ <esc>:tabprevious<CR>
inoremap ¬ <esc>:tabnext<CR>

" SNIPPETS
" surround entire line inside a console.log()
nnoremap <leader>c ^iconsole.log(<esc>$a);<esc>

" setTimeout
nnoremap <leader>set SsetTimeout(() => {})<left><left><CR><esc>O

" alternative mapping for quitting
nnoremap <leader>q :q<CR>

" alternative mapping for saving
nnoremap <leader>w :w<CR>
nnoremap <leader>j :w<CR>

" Comment/uncomment out line (normal)
nnoremap <C-m> :normal I// <CR>
nnoremap <C-c> :normal ^vlld<CR>
" ...and for visual
vnoremap <C-m> :normal I// <CR>
vnoremap <C-c> :normal ^vlld<CR>

" shortcut for CtrlPBuffer
nnoremap <leader>b :CtrlPBuffer<CR>

" shortcut to view previous buffer
nnoremap <leader>3 :b#<CR>

" shortcut to copy current filename to clipboard
nnoremap <leader>y :let @* = expand('%')<CR>

" shortcut to redraw
nnoremap <leader>r :redraw!<CR>

" shortcut to copy to clipboard
vnoremap <leader>8 "*y<CR>

" Ctrl clear cache
nnoremap <leader>p :CtrlPClearCache<CR>

" Move tab to beginning
nnoremap <leader>t :tabm 0<CR>

" ranger.vim breaks editor config...
nnoremap <leader>e :EditorConfigReload<CR>
