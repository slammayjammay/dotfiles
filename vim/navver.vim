command! -nargs=* Navver call Navver(<q-args>)

function! Navver(...)
	let b:navver_reg = a:0 > 0 ? a:1 : v:null
	let b:navver_items = []
	let b:navver_idx = 0

	setlocal nomodifiable
	setlocal foldmethod=manual

	nnoremap <buffer> q :q<CR>
	nnoremap <buffer> A :<C-u>call NavverBy(-1)<CR>
	nnoremap <buffer> H :<C-u>call NavverBy(-1)<CR>
	nnoremap <buffer> L :<C-u>call NavverBy(1)<CR>
	nnoremap <buffer> D :<C-u>call NavverBy(1)<CR>
	nnoremap <buffer> J <C-e>
	nnoremap <buffer> S <C-e>
	nnoremap <buffer> K <C-y>
	nnoremap <buffer> W <C-y>
	nnoremap <buffer> <expr> J v:count1 . "\<C-e>"
	nnoremap <buffer> <expr> K v:count1 . "\<C-y>"
	nnoremap <buffer> F :call NavverTo(-1)<CR>
	nnoremap <buffer> ) :call NavverTo(0)<CR>
	nnoremap <buffer> $ :call NavverSync()<CR>
	nnoremap <buffer> > :call NavverSync()<CR>

	call NavverSync()
endfunction

function! NavverSync()
	call NavverCollect()
	call NavverTo(len(b:navver_items) - 1)
endfunction

function! NavverCollect()
	let b:navver_items = []
	let lnum = 1
	while lnum <= line('$')
		if getline(lnum) =~# b:navver_reg
			call add(b:navver_items, lnum)
		endif
		let lnum += 1
	endwhile
endfunction

function! NavverTo(idx)
	if len(b:navver_items) == 0 || a:idx < -1
		return
	endif

	let idx = max([-1, min([a:idx, len(b:navver_items) - 1])])
	let b:navver_idx = idx
	normal! zE

	if idx == -1
		echo 'Expanded'
		return
	endif

	let lnum = b:navver_items[idx]
	if lnum > 1
		exe '1,' . (lnum - 1) . 'fold'
	endif
	if idx + 1 < len(b:navver_items)
		exe b:navver_items[idx + 1] . ',$fold'
	endif
	exe 'normal ggj'
	echo (idx + 1) . ' of ' . (len(b:navver_items))
endfunction

function! NavverBy(dir)
	let c = v:count1

	if empty(b:navver_items)
		call NavverCollect()
	endif

	call NavverTo(b:navver_idx + a:dir * c)
endfunction
