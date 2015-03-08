#!/usr/bin/env sh

for file in public/javascript/*.es6
do

	echo $file

	filename="$(echo $file | sed "s/es6/js/")"
	babel $file --out-file $filename

done

echo "done."
