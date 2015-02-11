
const what = function (val) {
	return Object.prototype.toString.call(val).toLowerCase().slice(8, -1)
}





const classes = ['array', 'boolean', 'date', 'error', 'function',
	'null', 'number', 'object', 'regexp', 'string', 'undefined']





const is = ( function () {

	const a = function (str, val) {

		if (Object.prototype.toString.call(str) !== '[object String]') {
			throw TypeError('a: the argument matching "str" must be a string.')
		}

		return Object.prototype.toString.call(val).toLowerCase() ===
			"[object " + str.toLowerCase() + "]"
	}

	return classes.reduce(function (self, key) {

		self[key] = a.bind({}, key)
		return self

	}, a)

} )()



const always = ( function () {

	const always = function (str, val) {
		if (!is[str](val)) {
			throw 'always.' + str + ': value was not a ' + str + ' (actual type was ' + what(val) + ')'
		}
	}

	return classes.reduce(function (self, key) {

		self[key] = always.bind({}, key)
		return self

	}, always)

} )()





const never = ( function () {

	const never = function (str, val) {
		if (is[str](val)) {
			throw 'always.' + str + ': value was not a ' + str + ' (actual type was ' + what(val) + ')'
		}
	}

	return classes.reduce(function (self, key) {

		self[key] = never.bind({}, key)
		return self

	}, never)

} )()




is.a      = is
is.what   = what
is.always = always
is.never  = never
