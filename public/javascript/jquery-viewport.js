
const inView = function ($elems) {

	var $window = $(window)
	var top     = $window.scrollTop()

	return $elems.filter(function (ith) {

		var $this   = $(this)
		var offset  = $this.offset()

		return top < offset.top + $this.height() && ($window.height() + top) > offset.top

	})

}
