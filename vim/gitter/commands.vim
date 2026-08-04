vim9script

export def GetLog(): list<string>
	var output = system('git log --oneline')
	return split(output, '\n')
enddef

export def GetCommitRange(start: string, end: string): string
	return empty(end) ? start : start .. '..' .. end
enddef

export def GetDiffFiles(start: string, end: string): list<string>
	var range = GetCommitRange(start, end)
	var output = system('{ git diff --name-status ' .. range .. '; git status --porcelain | grep "??" }')
	return split(output, '\n')
enddef

export def DiffFile(file: string, start: string, end: string): list<string>
	var cmd = 'git diff ' .. start
	if !empty(end)
		cmd ..= '..' .. end
	endif
	cmd ..= ' -- ' .. shellescape(file)
	var output = systemlist(cmd)
	return output
enddef
