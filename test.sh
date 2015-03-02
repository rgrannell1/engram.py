#!/usr/bin/env sh

set -e




echo '========== running python tests ============='

for fpath in $(find ./engram/tests/ -name "test_*")
do

	echo '============================================='
	echo "$fpath"
	echo '============================================='

	python3 "$fpath"

done
