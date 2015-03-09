"use strict";

$(window).on("scroll", function () {

	var $window = $(window);

	ENGRAM.eventBus.publish(":scroll", {

		windowTop: $window.scrollTop(),
		scrollHeight: $(document).height(),
		scrollPosition: $window.height() + windowTop

	});
});

ENGRAM.eventBus.subscribe(":scroll", function detectEdge(_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atTop", {});
	} else if (windowTop < 50) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atBottom", {});
	}
});
