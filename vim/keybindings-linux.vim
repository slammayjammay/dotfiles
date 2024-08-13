vnoremap <leader>8 y:call system('cat \| xsel -b', getreg('"'))<CR>
nnoremap <leader>y y:call system('echo ' . expand('%') . ' \| xsel -b')<CR>
