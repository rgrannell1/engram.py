
/*
	http://math.stackexchange.com/questions/64716/approximating-the-logarithm-of-the-binomial-coefficient
*/

const lnChoose = function (n, m) {
	return n * Math.log(n) - m * Math.log(m) - (n - m) * Math.log(n - m)
}
