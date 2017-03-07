" @See /usr/local/Cellar/vim/8.0.0045/share/vim/vim80/syntax/javascript.vim.
" The above doesn't include ` as a string denoter. So attempt to add it here.
syn region  javaScriptStringT	       start=+`+  skip=+\\\\\|\\`+  end=+`\|$+	contains=javaScriptSpecial,@htmlPreproc
hi def link javaScriptStringT		String
