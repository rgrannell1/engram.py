#!/usr/bin/env python3

import http
import requests
from result import Success, Failure





def request_head(url):
	"""
	get the resource associated with a url.
	"""

	try:
		# -- todo; eliminate pesky assignment so can be put into chain of Success then's.

		user_agent = 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'

		response = requests.head(url, headers = {
			'User-agent': user_agent,
			'Connection': 'close'
		}, timeout = 30)

		return response

	except http.client.BadStatusLine as err:

		return Failure({
			'message': "%s returned an unrecognised status." % (url, ),
			'code':    404
		})

	except requests.exceptions.ConnectionError as err:

		return Failure({
			'message': "%s refused the connection." % (url, ),
			'code':    404
		})

	except requests.exceptions.Timeout as err:

		return Failure({
			'message': "%s timed out." % (url, ),
			'code':    404
		})

	except Exception as err:

		return Failure(err)
