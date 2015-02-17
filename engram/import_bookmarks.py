#!/usr/bin/env python3

from result        import Success, Failure
from request_url   import request_url

from lxml          import etree
from bookmark      import bookmark, getID





def save_bookmarks(db, attrs):
	print(attrs)




def extract_tag_data(a):

	return {
		'url':   a.get('href'),
		'ctime': a.get('time_added')
	}





def extract_a_tags(html):

	return (
		Success(html)
		.then(etree.HTML)
		.then(lambda tree: tree.xpath('//a'))
		.then(lambda tags: [extract_tag_data(tags) for tag in tags])
	)





def import_bookmark_list(url):

	return (
		Success(url)
		.then(request_url)
		.then(lambda req: req.text)
		.then(extract_a_tags)
	)






def import_bookmarks(db):

	import_result = (
		Success(url)
		.then(import_bookmark_list)
		.then(lambda attrs: save_bookmarks(db, attrs))
	)

	return '', 200
