" newlines
imap <C-]> <esc>O
imap <C-\> <esc>o

" tabbing
nnoremap <C-j> :tabprevious<CR>
nnoremap <C-S-l> :tabnext<CR>
nnoremap <C-t> :tabnew<CR>:e .<CR>
nnoremap ∆ :tabprevious<CR>
nnoremap ¬ :tabnext<CR>
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

" alternative mapping for saving
nnoremap <leader>w :w<CR>

" Comment/uncomment out line (normal)
nnoremap <C-m> :normal I// <CR>
nnoremap <C-c> :normal ^vlld<CR>
" ...and for visual
vnoremap <C-m> :normal I// <CR>
vnoremap <C-c> :normal ^vlld<CR>

" shortcut for CtrlPBuffer
nnoremap <leader>b :CtrlPBuffer<CR>
