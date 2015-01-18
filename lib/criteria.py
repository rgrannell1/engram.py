#!/usr/bin/env python

from result           import Success, Failure
import utils




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
	return Success(oldest_param).then(lambda str: max(0, str))





subcriteria = {
	'sort':   sort_criteria,
	'host':   host_criteria,
	'query':  query_criteria,
	'oldest': oldest_critera
}








def criteria(request):

	params = ['sort', 'host', 'query', 'oldest']

	args            = {key : request.args.get(key) for key in params}
	search_criterea = {key : subcriteria[key](args[key]) for key in params}






	def add_criterion(dict, criterion):

		val = search_criterea[criterion]
		return (
			Success(val)
			.then( lambda val: utils.add_key(dict, criterion, val) )
		)






	return (

		Success({})
		.then(lambda dict: add_criterion(dict, 'sort'))
		.then(lambda dict: add_criterion(dict, 'host'))
		.then(lambda dict: add_criterion(dict, 'query'))
		.then(lambda dict: add_criterion(dict, 'oldest'))

	)
