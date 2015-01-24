

/*
	inView :: [elem] -> [elem]

	select DOM elements that match the user's y scroll position.
*/

const inView = ( function () {

	const $window = $(window)

	const elemInView = function (top) {

		var $this   = $(this)
		var offset  = $this.offset()

		return top < (offset.top + $this.height()) && ($window.height() + top) > offset.top

	}

	return function ($elems) {

		var top = $window.scrollTop()
		return $elems.filter(elemInView.bind(null, top))

	}

} )()


