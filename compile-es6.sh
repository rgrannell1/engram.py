#!/usr/bin/env sh

for file in public/javascript/src/*.es6
do

	filename="$(
		echo $file |
		sed "s/es6/js/" |
		sed "s/javascript\/src/javascript\/lib/")
	"
	echo $file "->" $filename

	babel $file --out-file $filename

done

echo "done."
