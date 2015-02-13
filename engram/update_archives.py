#!/usr/bin/env python3

import sql
import time
import subprocess
from result import Success, Failure





def download_page(db, id):

	lookup_result = (
		Success(db)
		.then(lambda db: sql.lookup_bookmark(db, id))
		.then(lambda rows: rows[0][2])
	)

	try:

		command = ''.join([
			'dir=$(mktemp -d) && ',
			'wget --mirror --convert-links --adjust-extension --page-requisites --no-parent --quiet --timeout=20 ',
			'--directory-prefix=$dir -- ' + lookup_result.from_success(),
			'echo $dir'
		])

		stdout, stderr = subprocess.Popen(command, shell = True, stdout = subprocess.PIPE).communicate()

		if not stderr:

			tmp_path = stdout.decode('utf8')
			print(tmp_path)


		a

	except Exception as err:
		raise err





def archive_id(db, id):

	#time.sleep(5)

	print( download_page(db, 1000) )





def update_archives(db):

	print ('running!')

	ids_result = (
		Success(db)
		.then(lambda db: sql.select_unarchived_bookmarks(db))
		.then(lambda tuples: {id for tuple in tuples for id in tuple})
	)

	print (
		ids_result
		.cross( [Success(db)] )
		.then( lambda pair: [archive_id(pair[1], id) for id in pair[0]] )
	)
