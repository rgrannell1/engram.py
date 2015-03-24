#!/usr/bin/env python3

import unittest
import sys
import os





sys.path.append(os.path.abspath('engram'))

from result import Success, Failure, Result





class TestResult(unittest.TestCase):

	def test_extraction(self):

		assert Success(0).value == 0
		assert Failure(0).value == 0

	def test_idempotency(self):

		assert Success(Success(0)).value == 0
		assert Failure(Failure(0)).value == 0

		assert Success(Failure(0)).value == 0
		assert Failure(Success(0)).value == 0

	def test_reflection(self):

		assert Success(0).is_success()
		assert not Success(0).is_failure()

		assert not Failure(0).is_success()
		assert Failure(0).is_failure()

	def test_then(self):

		msg = "it should return Results."

		assert Success(0).then(lambda x: x).is_success(), msg
		assert Failure(0).then(lambda x: x).is_failure(), msg

		msg = "success.then should be able to modify the contents of the result."

		assert Success(0).then(lambda x: x).value == 0, msg
		assert Success(1).then(lambda x: 0).value == 0, msg

		msg = "it should flatten Result objects."

		assert Success(1).then(lambda x: Success(0)).value == 0, msg
		assert Success(1).then(lambda x: Success(0)).is_success, msg

		assert Success(1).then(lambda x: Failure(0)).value == 0, msg
		assert Success(1).then(lambda x: Failure(0)).is_failure, msg




unittest.main()
