#!/usr/bin/env sh

set -e





echo '============================================='
echo '======== running javascript tests ==========='
echo '============================================='

for fpath in ./jstests/*
do
	phantomjs "$fpath"
done

echo '============================================='
echo '========== running python tests ============='
echo '============================================='

for fpath in $(find ./engram/tests/ -name "test_*")
do
	#python3 "$fpath"
done
