" newlines
imap <C-]> <esc>O
imap <C-\> <esc>o

" tabbing
nnoremap <C-j> :tabprevious<CR>
nnoremap <C-S-l> :tabnext<CR>
nnoremap <C-t> :tabnew<CR>:e .<CR>
inoremap <C-j> <esc>:tabprevious<CR>
inoremap <C-S-l> <esc>:tabnext<CR>
inoremap <C-t> <esc>:tabnew<CR>:e .<CR>
