vim9script

import './home.vim' as home

def GDInit(): void
  home.Enter()
enddef

command! GD GDInit()
