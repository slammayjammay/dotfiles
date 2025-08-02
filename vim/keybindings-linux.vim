vnoremap <leader>8 y:call system('cat \| xsel -b', getreg('"'))<CR>
nnoremap <leader>y :call system('xsel -b', expand("%:~:."))<CR>
