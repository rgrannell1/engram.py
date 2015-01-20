
## Performance

~ 300 bytes per bookmark DOM element (20 Jan 2015), before the addition of tags and keys.

Engram should working within a range of 1 to 10,000 bookmarks (roughly five bookmarks a day
for half a decade). 10,000 bookmarks is roughly 3Mb.

DB will be roughly 700kb excluding archives, based on a test database.






response times are roughly 15ms for small data.

This is good; according to

http://cogsci.stackexchange.com/questions/1664/what-is-the-threshold-where-actions-are-perceived-as-instant

all data should be given in 100ms, since this time is percieved as instant.




### 20 January 2015

1.38 seconds to load 10,000 entries (0.000138 per entry).

This is terrible.

10 seconds to search across the entire DOM for 'for' with Ctrl + f. This will only be solved some sort of
cusom search.

scrolling to footer is fine; not difficult.
