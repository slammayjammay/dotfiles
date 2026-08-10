vim9script

# dispuffer -- copies current buffer in a new one intended for temporary use

command! -nargs=* DSP CreateAsText(bufnr('%'))

var OnExitCb: func = () => null

export def CreateAsText(buffer: number)
		var lines = getbufline(buffer, 1, '$')
		var settings = GetBufferSettings(buffer)
		enew
		call append(0, lines)
		ApplyBufferSettings(settings)
		Setup()
enddef

export def CreateAsTerm(buffer: number, Cb: any = null)
	var tmp = '/tmp/dispuffer-' .. getpid() .. '.dump'
	call term_dumpwrite(buffer, tmp)
	call term_dumpload(tmp)
	call delete(tmp)
	execute 'only'
	Setup()
	set nonumber
	set norelativenumber

	OnExitCb = Cb
enddef

export def Setup()
	set modifiable
	nnoremap <buffer> q <ScriptCmd>Exit()<CR>
	nnoremap <buffer> <C-q> <ScriptCmd>Exit()<CR>
	execute ':normal gg'
enddef

export def GetBufferSettings(buffer: number): dict<any>
	var setting_names = ['filetype', 'number', 'relativenumber', 'nonumber', 'norelativenumber', 'expandtab', 'tabstop', 'shiftwidth', 'softtabstop']
	var settings = {}

	for name in setting_names
		settings[name] = getbufvar(buffer, '&' .. name)
	endfor

	return settings
enddef

export def ApplyBufferSettings(settings: dict<any>)
	var current_buf = bufnr('%')

	for name in settings->keys()
		try
			setbufvar(current_buf, '&' .. name, settings[name])
		catch
		endtry
	endfor
enddef

export def Exit()
	execute ':bd!'
	OnExitCb()
enddef
