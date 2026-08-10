vim9script

import '../dispuffer/dispuffer.vim'

command! -nargs=* Navver Navver(<args>)

export def Navver(reg: string = '')
	b:navver_reg = reg
	b:navver_items = []
	b:navver_idx = 0

	setlocal foldmethod=manual

	nnoremap <buffer> A <ScriptCmd>NavverBy(-1)<CR>
	nnoremap <buffer> H <ScriptCmd>NavverBy(-1)<CR>
	nnoremap <buffer> L <ScriptCmd>NavverBy(1)<CR>
	nnoremap <buffer> D <ScriptCmd>NavverBy(1)<CR>
	nnoremap <buffer> J <C-e>
	nnoremap <buffer> S <C-e>
	nnoremap <buffer> K <C-y>
	nnoremap <buffer> W <C-y>
	nnoremap <buffer> <expr> J v:count1 .. "\<C-e>"
	nnoremap <buffer> <expr> K v:count1 .. "\<C-y>"
	nnoremap <buffer> F <ScriptCmd>NavverTo(-1)<CR>
	nnoremap <buffer> ) <ScriptCmd>NavverTo(0)<CR>
	nnoremap <buffer> $ <ScriptCmd>NavverSync()<CR>
	nnoremap <buffer> > <ScriptCmd>NavverSync()<CR>

	NavverSync()
enddef

export def NavverSync()
	NavverCollect()
	NavverTo(len(b:navver_items) - 1)
enddef

export def NavverCollect()
	b:navver_items = []
	var lnum = 1
	while lnum <= line('$')
		if getline(lnum) =~# b:navver_reg
			b:navver_items->add(lnum)
		endif
		lnum += 1
	endwhile
enddef

export def NavverTo(idx: number)
	if len(b:navver_items) == 0 || idx < -1
		return
	endif

	var idx_clamped = max([-1, min([idx, len(b:navver_items) - 1])])
	b:navver_idx = idx_clamped
	normal! zE

	if idx_clamped == -1
		echo 'Expanded'
		return
	endif

	var lnum = b:navver_items[idx_clamped]
	if lnum > 1
		execute ':1,' .. (lnum - 1) .. 'fold'
	endif
	if idx_clamped + 1 < len(b:navver_items)
		execute ':' .. b:navver_items[idx_clamped + 1] .. ',$fold'
	endif
	execute 'normal ggj'
	echo (idx_clamped + 1) .. ' of ' .. (len(b:navver_items))
enddef

export def NavverBy(dir: number)
	var c = v:count1

	if empty(b:navver_items)
		NavverCollect()
	endif

	NavverTo(b:navver_idx + dir * c)
enddef
