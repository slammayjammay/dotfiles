vim9script

import './home.vim' as home
import './commands.vim' as commands

var OnExitCb: func

export def Enter(Cb: func): void
	OnExitCb = Cb
	tabnew
	set buftype=nofile
	set bufhidden=hide
	set filetype=diff
	set noswapfile
	set nonumber
	set norelativenumber
	nnoremap <buffer> q <ScriptCmd>Exit()<CR>
	nnoremap <buffer> <Esc> <ScriptCmd>Exit()<CR>
enddef

export def Show(filename: string, start: string, end: string): void
	var diff_content = commands.DiffFile(filename, start, end)
	append(0, diff_content)
	execute 'normal gg'
enddef

export def ShowUntracked(filename: string): void
	var diff_content = systemlist('git diff --no-index /dev/null ' .. shellescape(filename) .. ' 2>/dev/null')
	append(0, diff_content)
	execute 'normal gg'
enddef

def Exit(): void
	execute 'bd!'
	OnExitCb()
enddef
