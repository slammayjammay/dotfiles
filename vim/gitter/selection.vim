vim9script

import './commands.vim' as commands
import './home.vim' as home

var OnExitCb: func
var selected: string

export def Enter(Cb: func): void
	OnExitCb = Cb
	enew
	nnoremap <buffer> <CR> <ScriptCmd>Choose()<CR>
	nnoremap <buffer> q <ScriptCmd>Cancel()<CR>
	nnoremap <buffer> <Esc> <ScriptCmd>Cancel()<CR>
	Render()
enddef

def Render(): void
	silent! :%delete

	setline(line('.'), '(reset)')

	for commit in commands.GetLog()
		append(line('$'), commit)
	endfor

	execute 'normal gg'
	echo 'Select commit'
enddef

def Choose(): void
	var line = getline(line('.'))

	if line == '(reset)'
		selected = ''
	else
		selected = split(line)[0]
	endif

	Cancel()
enddef

def Cancel(): void
	execute 'bd!'
	OnExitCb(selected)
enddef
