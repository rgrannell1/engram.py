#!/usr/bin/env python3

from result import Success, Failure






def get_arg(request, str):

	arg = request.args.get(str)

	if arg is None:
		return Failure({
			'message': '%s must be included in the URI.' % (str,),
			'code':    422
		})
	else:
		return Success(arg)





def display_fetch_result(result):

	if result.is_failure():

		failure = result.from_failure()

		if isinstance(failure, dict):
			return failure['message'], failure['code']
		else:
			return "failed to fetch: '%s'" % (failure,), 500

	else:
		return result.from_success(), 200





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





def process_amount_id(amount_id):

	try:
		max_id = int(max_id)
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





def process_fetch_request(db, request):

	args_result = (

		Success((
			get_arg(request, 'max_id').then(process_max_id),
			get_arg(request, 'amount').then(process_amount)
		))
		.productOf()
		.then(lambda args: {
			'max_id': process_max_id(args[0]),
			'amount': process_amount(args[1])
		})

	)


	route_result = (
		args_result
		.then( lambda args: fetch_chunk(db, args['max_id'], args['amount']) )
	)

	return display_fetch_result(route_result)
