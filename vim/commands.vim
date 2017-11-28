" ignore directories for ctrlp
function! Ignore(...)
	let l:idx = 0

	while l:idx < a:0
		let l:directory = a:000[l:idx]
		execute "set wildignore+=" . "*/" . l:directory . "/*"

		let l:idx += 1
	endwhile
endfunction
command! -nargs=* Ignore call Ignore(<f-args>)
