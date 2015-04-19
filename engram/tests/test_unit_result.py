#!/usr/bin/env python3

import unittest
import sys
import os





sys.path.append(os.path.abspath('engram'))

from result import Ok, Err, Result





class TestResult(unittest.TestCase):

	def test_extraction(self):

		assert Ok(0).value == 0
		assert Err(0).value == 0

	def test_idempotency(self):

		assert Ok(Ok(0)).value == 0
		assert Err(Err(0)).value == 0

		assert Ok(Err(0)).value == 0
		assert Err(Ok(0)).value == 0

	def test_reflection(self):

		assert Ok(0).is_ok()
		assert not Ok(0).is_err()

		assert not Err(0).is_ok()
		assert Err(0).is_err()

	def test_then(self):

		msg = "it should return Results."

		assert Ok(0).then(lambda x: x).is_ok(), msg
		assert Err(0).then(lambda x: x).is_err(), msg

		msg = "success.then should be able to modify the contents of the result."

		assert Ok(0).then(lambda x: x).value == 0, msg
		assert Ok(1).then(lambda x: 0).value == 0, msg

		msg = "it should flatten Result objects."

		assert Ok(1).then(lambda x: Ok(0)).value == 0, msg
		assert Ok(1).then(lambda x: Ok(0)).is_ok, msg

		assert Ok(1).then(lambda x: Err(0)).value == 0, msg
		assert Ok(1).then(lambda x: Err(0)).is_err, msg




unittest.main()
