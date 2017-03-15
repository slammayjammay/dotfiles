" @See /usr/local/Cellar/vim/8.0.0045/share/vim/vim80/syntax/javascript.vim.
" The above doesn't include ` as a string denoter. So attempt to add it here.
syn region  javaScriptStringT	       start=+`+  skip=+\\\\\|\\`+  end=+`\|$+	contains=javaScriptSpecial,@htmlPreproc
hi def link javaScriptStringT		String

" ------- Highlight instance methods -------
" First highlight the entire line that contains something of the form:
" someWord(arg, arg2) {
" WITHOUT the "=>" to denote anonymous functions
syntax region es6InstanceMethod start="\v[ \t]*\w+\(" end="\v\w*[^\(]*\) [^\=>]*\{"me=e-1 oneline
" ...But then de-highlight the arguments inside "()"
syntax region es6InstanceMethodProps start="\v\("ms=s+1 end="\v\)"me=e-1 containedin=es6InstanceMethod
