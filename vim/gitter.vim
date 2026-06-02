function! Gitter()
  let g:gitter_source_buf = bufnr('%')

	set foldtext=getline(v:foldstart)

  nnoremap <buffer> <CR>  :call GitterRunLine()<CR>
  nnoremap <buffer> <Esc> :call GitterExit()<CR>

  echo "Gitter -- <Enter> to select, <Esc> to exit"
endfunction

function! GitterRunLine()
  let l:line = getline('.')
  if l:line == ''
    return
  endif

  let l:script = expand('$HOME') . '/me/dotfiles/vim/gitter.sh'
  let l:term = term_start([l:script, getcwd(), l:line], {'curwin': 1})
	call s:poll_init(l:term)
  let g:gitter_term_buf = bufnr('%')

  nnoremap <buffer> <CR>  :call GitterBack()<CR>
  nnoremap <buffer> <Esc> :call GitterBack()<CR>
endfunction

function! s:poll_init(term) abort
	let l:state = {'last_count': 0, 'stable_count': 0}
	call timer_start(20, function('s:poll_iter', [a:term, l:state]), {'repeat': -1})
endfunction

function! s:poll_iter(term, state, timer) abort
  let l:current = len(getbufline(a:term, 1, '$'))
  if l:current == a:state.last_count
    let a:state.stable_count += 1
    if a:state.stable_count >= 2
      call timer_stop(a:timer)
			call s:poll_done()
    endif
  else
    let a:state.stable_count = 0
  endif
  let a:state.last_count = l:current
endfunction

function! s:poll_done()
	call feedkeys("ggjjV/@\<CR>zfgg", 'n')
endfunction

function! GitterBack()
  execute 'buffer ' . g:gitter_source_buf
  if bufexists(g:gitter_term_buf)
    execute 'bdelete! ' . g:gitter_term_buf
  endif
endfunction

function! GitterExit()
  nunmap <buffer> <CR>
  nunmap <buffer> <Esc>
  echo "Gitter exited"
endfunction

command! GD call Gitter()
