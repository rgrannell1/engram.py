

/*
	inView :: [elem] -> [elem]

	select DOM elements that match the user's y scroll position.
*/

const inView = ( function () {

	const $window = $(window)

	return function ($elems) {

		const top = $window.scrollTop()

		return $elems.filter( function () {

			var $this   = $(this)
			var offset  = $this.offset()

			return top < (offset.top + $this.height()) && ($window.height() + top) > offset.top

		} )
	}

} )()


