#!/usr/bin/env python3

from result         import Success, Failure
from fetch_chunk    import fetch_chunk
from display_result import display_result





def get_arg(request, str):

	try:
		query_arg = request.args.get(str)
	except Exception as err:
		return Failure(err)
	else:
		return Success(query_arg) if query_arg is None else Failure({
			'message': '%s must be included in the URI.' % (str,),
			'code':    422
		})





def process_max_id(max_id):

	try:
		max_id = int(max_id)
	except Exception as err:
		return Failure(err)
	else:
		if max_id < 0:
			return Failure({
				'message': 'max_id must be larger than zero.',
				'code':    422
			})

		elif max_id > 9223372036854775807:
			# -- good to have an upper limit on fields.
			return Failure({
				'message': 'max_id was too large.',
				'code':    422
			})
		else:
			return max_id




def process_amount(amount):

	try:
		amount = int(amount)
	except Exception as err:
		return Failure(err)
	else:
		if amount < 0:
			return Failure({
				'message': 'amount must be larger than zero.',
				'code':    422
			})
		elif amount > 9223372036854775807:
			# -- good to have an upper limit on fields.
			return Failure({
				'message': 'amount was too large.',
				'code':    422
			})
		else:
			return amount





def process_fetch_request(db, request):

	args_result = (

		Success((
			get_arg(request, 'max_id').then(process_max_id),
			get_arg(request, 'amount').then(process_amount)
		))
		.productOf() # -- probably broken.
		.then(lambda query_args: {
			'max_id': query_args[0],
			'amount': query_args[1]
		})

	)

	route_result = (
		args_result
		.then( lambda args: fetch_chunk(db, args['max_id'], args['amount']) )
		.then( lambda response: {
			'message': response,
			'code':    200
		})
	)

	return display_result(route_result)
