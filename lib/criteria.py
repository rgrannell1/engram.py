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





criteria = {
	'sort':   sort_criteria,
	'host':   lambda x: x,
	'query':  lambda x: x,
	'oldest': lambda x: x
}





def criteria(request):

	params = ['sort', 'host', 'query', 'oldest']

	args            = {key : request.args.get(key) for key in params}
	search_criterea = {key : criteria[key](args[key]) for key in params}

	print('-------------')
	print(search_criterea)
	print('-------------')

	return (
		Success({})
		.then( lambda dict: dict.update({'sort': sort_criteria(args['sort']) }) )
	)
