vim9script

import './vimterm/vimterm.vim' as vimterm
import './dispuffer/dispuffer.vim' as dispuffer
import './navver/navver.vim' as navver

command! -nargs=* C Claude(<f-args>)

export def Claude(...args: list<string>)
	var cmd = 'claude'
	if len(args) > 0
		cmd ..= ' ' .. join(args, ' ')
	endif

	call vimterm.VimTerm(cmd)

	tnoremap <buffer> <C-a> <C-w>N<ScriptCmd>OpenNavver()<CR>
	nnoremap <buffer> <C-a> <ScriptCmd>navver.NavverSync()<CR>
enddef

def OpenNavver()
	vimterm.ModeNormal()
	navver.Navver('^[❯\!]\s')
enddef
