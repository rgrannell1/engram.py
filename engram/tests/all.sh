#!/usr/bin/env sh

set -e





for fpath in $(find ./ -name "test_*")
do
	python3 "$fpath"
done
