vim9script

import '../dispuffer/dispuffer.vim'

command! -nargs=* V VimTerm(<f-args>)

export def VimTerm(...args: list<string>)
	var cmd = 'terminal ++curwin'
	if len(args) > 0
		cmd ..= ' ' .. join(args, ' ')
	endif
	execute cmd

	setlocal norelativenumber
	setlocal nonumber

	nnoremap <buffer> <Nul> i
	nnoremap <buffer> <C-x> <ScriptCmd>LoadTermJob()<CR>
	nnoremap <buffer> <C-q> :q!<CR>
	tnoremap <buffer> <C-x> <C-w>N
	tnoremap <buffer> <Nul> <ScriptCmd>ModeNormal()<CR>
	tnoremap <buffer> <C-q> <C-w>N:q!<CR>
enddef

export def ModeNormal()
	feedkeys("\<C-w>N", 'n')
enddef

def LoadTermJob()
	b:vimtermview = winsaveview()
	normal! i
	timer_start(0, (...args) => LoadTermJob2())
enddef

def LoadTermJob2()
	feedkeys("\<C-w>N", 'n')
	timer_start(0, (...args) => LoadTermJob3())
enddef

def LoadTermJob3()
	winrestview(b:vimtermview)
enddef
