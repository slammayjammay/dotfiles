vim9script

import './commands.vim' as commands
import './differ.vim' as differ
import './selection.vim' as selection

var commit_from = 'HEAD'
var commit_to = ''

export def Enter(): void
	enew
	execute 'file Gitter'
	nnoremap <buffer> <CR> <ScriptCmd>HandleEnter()<CR>
	nnoremap <buffer> q <ScriptCmd>Cancel()<CR>
	Render()
enddef

export def Render(): void
	silent! :%delete

	setline(line('.'), 'GITTER')
	append(line('$'), '')

	append(line('$'), '==========')
	append(line('$'), 'From: ' .. commit_from)
	append(line('$'), 'To:   ' .. commit_to)
	append(line('$'), '==========')

	if !empty(commit_from)
		var files = commands.GetDiffFiles(commit_from, commit_to)

		if empty(files)
			cursor(search('^From: '), 1)
		else
			append(line('$'), '')
			for file_line in files
				append(line('$'), file_line)
			endfor

			cursor(search('^To: ') + 3, 1)
		endif
	endif

	echo 'Welcome to Gitter. Press Escape/q to quit, Enter to interact.'
enddef

def HandleEnter(): void
	var line = getline('.')

	if line =~ '^From: '
		selection.Enter((selected: string) => {
			if !empty(selected)
				commit_from = selected
			endif
			Render()
		})
	elseif line =~ '^To: '
		selection.Enter((selected: string) => {
			if !empty(selected)
				commit_to = selected
			endif
			Render()
		})
	else
		var parts = split(line, '\s')
		if len(parts) < 2
			return
		endif

		var status = parts[0]
		var filename = parts[1]

		differ.Enter(() => null)
		if status == '??'
			differ.ShowUntracked(filename)
		else
			differ.Show(filename, commit_from, commit_to)
		endif
	endif
enddef

def Cancel(): void
	execute 'qa!'
enddef
