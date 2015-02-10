#!/usr/bin/env sh

set -e





echo '============================================='
echo '======== running javascript tests ==========='
echo '============================================='

for fpath in $(find ./jstests/ -name "test_*")
do
	echo $($fpath)
	phantomjs "$fpath"
done

echo '============================================='
echo '========== running python tests ============='
echo '============================================='

for fpath in $(find ./engram/tests/ -name "test_*")
do
	#python3 "$fpath"
done
