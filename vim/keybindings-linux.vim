vnoremap <leader>8 y:call system('cat \| xsel -b', getreg('"'))<CR>
nnoremap <leader>y :call system('xsel -b', expand("%:~:."))<CR>
nnoremap <leader><leader>v :call system('xsel -b', @v)<CR>
