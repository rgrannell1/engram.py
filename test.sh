#!/usr/bin/env sh

set -e




echo '============================================='
echo '========== running python tests ============='
echo '============================================='

for fpath in $(find ./engram/tests/ -name "test_*")
do
	python3 "$fpath"
done
