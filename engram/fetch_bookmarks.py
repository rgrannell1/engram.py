#!/usr/bin/env python3

from result         import Ok, Err, Result
from fetch_chunk    import fetch_chunk
from display_result import display_result





def get_arg(request, str):

	try:
		query_arg = request.args.get(str)
	except Exception as err:
		return Err(err)
	else:
		return Ok(query_arg) if query_arg is not None else Err({
			'message': '%s must be included in the URI.' % (str,),
			'code':    422
		})





def process_max_id(max_id):

	try:
		max_id = int(max_id)
	except Exception as err:
		return Err(err)
	else:
		if max_id < 0:
			return Err({
				'message': 'max_id must be larger than zero.',
				'code':    422
			})

		elif max_id > 1000000:
			# -- good to have an upper limit on fields.
			return Err({
				'message': 'max_id was too large.',
				'code':    422
			})
		else:
			return max_id




def process_amount(amount):

	try:
		amount = int(amount)
	except Exception as err:
		return Err(err)
	else:
		if amount < 0:
			return Err({
				'message': 'amount must be larger than zero.',
				'code':    422
			})
		elif amount > 1000000:
			# -- good to have an upper limit on fields.
			return Err({
				'message': 'amount was too large.',
				'code':    422
			})
		else:
			return amount





def fetch_bookmarks(db, request):

	args_result = (

		Ok((
			get_arg(request, 'max_id').then(process_max_id),
			get_arg(request, 'amount').then(process_amount)
		))
		.product_of()
	)

	route_result = (
		args_result
		.then( lambda args: fetch_chunk(db, *args) )
		.then( lambda response: {
			'message': response,
			'code':    200
		})
	)

	return display_result(route_result)
