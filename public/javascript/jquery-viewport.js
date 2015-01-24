/*

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
*/





const inView = function ($elems) {

	var $window = $(window)

	return $elems.filter(function (ith) {

		var $this   = $(this)
		var offset  = $this.offset()

		return top < offset.top + $this.height() && ($window.height() + $window.scrollTop()) > offset.top

	})

}
