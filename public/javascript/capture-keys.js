"use strict";

ENGRAM.eventBus.subscribe(":press-typeable", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY += key;

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});

ENGRAM.eventBus.subscribe(":press-backspace", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY = ENGRAM.QUERY.slice(0, -1);

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});

ENGRAM.eventBus.subscribe(":press-escape", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY = "";

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});
