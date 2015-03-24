"use strict";

var readDataURL = function readDataURL(reader, callback) {

	var dataURL = reader.result;
	var contentType = "data:text/html;base64,";

	if (!dataURL.startsWith(contentType)) {
		alert("invalid data uri.");
	} else {

		var htmlBase64 = dataURL.slice(contentType.length);
		var html = atob(htmlBase64);

		// -- watch out for code-execution here.
		var $bookmarks = $($.parseHTML(html));
		var bookmarkData = $bookmarks.find("a").map(function (ith, link) {

			return {
				url: $(link).attr("href"),
				ctime: $(link).attr("time_added")
			};
		}).sort(function (bookmark0, bookmark1) {
			return bookmark0.ctime - bookmark1.ctime;
		});

		callback(bookmarkData);
	}
};

var uploadFile = function (retries, callback) {

	var $uploader = $("#uploader");
	var files = $uploader.prop("files");

	if (is.undefined(files[0])) {

		setTimeout(uploadFile.bind({}, retries - 1, callback), 100);
	} else if (retries === 0) {
		throw Error("expired.");
	} else {

		var reader = new FileReader();
		reader.readAsDataURL(files[0]);

		reader.onload = readDataURL.bind({}, reader, callback);
	}
};

var host = function (path) {
	return location.protocol + "//" + location.hostname + ":" + location.port + "/" + path;
};

var sendBookmarks = function sendBookmarks(bookmarks) {

	var entityBody = bookmarks.map(function (ith, bookmark) {
		return {
			url: encodeURIComponent(bookmark.url),
			ctime: bookmark.ctime
		};
	}).sort(function (bookmark0, bookmark1) {
		return bookmark0.ctime - bookmark1.ctime;
	});

	$.ajax({
		type: "POST",
		url: "/api/resave",

		dataType: "json",
		data: JSON.stringify({ data: entityBody }),
		headers: {
			"Content-Type": "application/json"
		}
	});
};

$(function () {
	$("#uploader").on("click", uploadFile.bind({}, 1000, sendBookmarks));
});
