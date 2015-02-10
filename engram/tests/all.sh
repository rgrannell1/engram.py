#!/usr/bin/env sh





for fpath in $(find ./ -name "test_*")
do
	python3 "$fpath"
done
