#!/usr/bin/env python

from result           import Success, Failure





def sort_criteria(sort_param):

	if not sort_param:
		return Success({
			'increasing': False,
			'by':         ctime
		})
	else:

		is_increasing = sort_param[0] == '-'
		column        = sort_param[1:] if is_increasing else sort_param

		if not column in set(["bookmark_id", "title", "url", "ctime"]):
			return Failure("%s is an invalid column to sort by " % column)
		else:

			return Success({
				'increasing': is_increasing,
				'by':         column
			})

def host_criteria(host_param):
	return host_param if host_param else ""

def query_criteria(query_param):
	return query_param if query_param else ""

def oldest_critera(oldest_param):

	try:
		return max(0, int(oldest_param))
	except Exception:
		return 0






criteria = {
	'sort':   sort_criteria,
	'host':   host_criteria,
	'query':  query_criteria,
	'oldest': oldest_critera
}




def criteria(request):

	params = ['sort', 'host', 'query', 'oldest']

	args            = {key : request.args.get(key) for key in params}
	search_criterea = {key : criteria[key](args[key]) for key in params}


	return (
		Success({})
		.then( lambda dict: dict.update({'sort': search_criterea['sort'] }) )
	)
