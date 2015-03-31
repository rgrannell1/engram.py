
# Testing

## Unit Tests

## System Tests




### Saving

Establish that saving via the URIs `domain/<path>` works correctly.

- Invalid websites (missing content-types, or with malformed headers) are either managed or
flagged with 404s.

- Popular websites save correctly, indicating saving will usually work correctly.

- Known malformed websites are managed or flagged.

- Successful saves are flagged with 204s to prevent page reloading.

- Failed saves return the status code and an error message page.





### Loading

Verify saved bookmarks are actually retrievable.

- Saving to an empty database adds new bookmarks accessible on loading `/`

- Validate that URIs are not modified by saving.

- Each bookmark stores a sensible date.

- Each bookmark has a non-empty title.

- Failed bookmarks are not saved.




### Deleting

Verify that each bookmark can be deleted.



### Importing




### Archiving




