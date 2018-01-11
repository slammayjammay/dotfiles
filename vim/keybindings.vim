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
" append console.log() with indent
nnoremap <leader>log aconsole.log()<esc>==f)i

" surround entire line inside a console.log()
nnoremap <leader>c ^iconsole.log(<esc>$a);<esc>

" alternative mapping for saving
nnoremap <leader>w :w<CR>
