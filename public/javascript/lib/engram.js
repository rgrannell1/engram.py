"use strict";

window.ENGRAM = {};

// how many bookmarks to append on scroll?
ENGRAM.PERSCROLL = 10;
ENGRAM.MAXLOADED = 50;
ENGRAM.BIGINT = 1000000;

// how many bookmarks to retrieve per request?
ENGRAM.PERREQUEST = 1000;

// how many milliseconds to wait between requests?
ENGRAM.LOADINTERVAL = 100;

// how many milliseconds to transition delete within?
ENGRAM.DELETEFADE = 250;

// how many pixels do you have to be from the botton of the
// page to load some more bookmarks?
ENGRAM.LOADOFFSET = 60;
ENGRAM.eventBus = EventBus();

{
	(function () {
		var setQuery = (function (_setQuery) {
			var _setQueryWrapper = function setQuery(_x) {
				return _setQuery.apply(this, arguments);
			};

			_setQueryWrapper.toString = function () {
				return _setQuery.toString();
			};

			return _setQueryWrapper;
		})(function (query) {

			setQuery.precond(query);

			this.previous = this.current;
			this.current = query;
		});

		setQuery.precond = function (query) {
			is.always.string(query);
		};

		ENGRAM.searchState = {
			previous: "",
			current: "",
			setQuery: setQuery

		};
	})();
}

{
	(function () {
		var setFocus = (function (_setFocus) {
			var _setFocusWrapper = function setFocus(_x) {
				return _setFocus.apply(this, arguments);
			};

			_setFocusWrapper.toString = function () {
				return _setFocus.toString();
			};

			return _setFocusWrapper;
		})(function (_ref) {
			var value = _ref.value;
			var currentQuery = _ref.currentQuery;

			setFocus.precond({ value: value, currentQuery: currentQuery });

			this.value = value;
			this.currentQuery = currentQuery;

			ENGRAM.eventBus.publish(":update-focus", this);
		});

		setFocus.precond = function (_ref) {
			var value = _ref.value;
			var currentQuery = _ref.currentQuery;

			is.always.array(value);
			is.always.string(currentQuery);
		};

		ENGRAM.inFocus = {
			value: {},
			currentQuery: "",
			setFocus: setFocus
		};
	})();
}
