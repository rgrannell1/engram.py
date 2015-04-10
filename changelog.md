
Engram v0.2.0
-------------------------------------------------

ENHANCEMENTS:

* Rewrote metadata extraction in node, making the process more reliable for non-unicode pages.

* Added h1 tags as a fallback, if the title was empty.

* Added support for multiple title and h1 tags.

* Added heuristic for removing titles of the form 'MyTitle | MySite', keeping 'MyTitle' instead.

* Added absolute date on hover over relative date.




2015-3-31
Engram v0.1.0
-------------------------------------------------

This is as good a time as ever as to start versioning. As of v0.1.0 Engram has 
html/pdf title extraction and generic URI title extraction. It has Twitter sharing, basic importing from Pocket, solid mimetype parsing, and bookmark deletion. On the client-side it live character capture/echoing to the address-bar to be used in search, some bad search code, and working infinite scroll.

There is a lot of work needed.




2015-2-23
-------------------------------------------------

* Added dedicated POST route at /restore/uri to save bookmarks to the database,
with additional configuration options available.
