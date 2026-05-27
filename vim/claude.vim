command! -nargs=* C call Claude(<f-args>)

function! Claude(...)
	exe 'terminal ++curwin claude' . (a:0 ? ' ' . join(a:000, ' ') : '')

	setlocal ttimeoutlen=0
	setlocal norelativenumber
	setlocal nonumber
	set autoread

	autocmd BufEnter * silent! checktime

	if exists('*Navver')
		call Navver()

		let b:navver_reg = '^[❯\!]\s'

		nnoremap <buffer> <Nul> i
		nnoremap <buffer> <C-x> :call LoadTermJob()<CR>
		tnoremap <buffer> <Nul> <C-w>N
		tnoremap <buffer> <C-x> <C-w>N:call NavverSync()<CR>
		tnoremap <buffer> <C-q> <C-w>N:q!<CR>
	endif
endfunction

function! LoadTermJob()
	let b:claudeview = winsaveview()
	normal! i
	call timer_start(0, {-> [LoadTermJob2()]})
endfunction

function! LoadTermJob2()
	call feedkeys("\<C-w>N", 'n')
	call timer_start(0, {-> LoadTermJob3()})
endfunction

function! LoadTermJob3()
	call winrestview(b:claudeview)
endfunction
