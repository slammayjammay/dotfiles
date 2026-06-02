#!/bin/zsh

cwd=$1
line=$2
type=""

if [[ "$line" =~ '[[:space:]]*([^[:space:]]+)[[:space:]]+(.+)' ]]; then
	type="${match[1]}"
	relative="${match[2]}"
fi

file="$cwd/$relative"

echo
echo
echo "$type  $relative "
echo

if [[ "$type" == "??" ]]; then
	echo "@"
	cat "$file"
elif [[ "$type" == "M" || "$type" == "D" ]]; then
	git --no-pager diff --color=always -- $file
fi
