"""
This module handle the memoization
for the results based on a simple dictionary
cache.
"""
from datetime import timedelta, datetime


class MemoryCache:
    """
    A simple on-memory cache to store
    any kind of responses to reuse in further
    requests.

    Attributes:
        cache (dict[str, dict]): Cached responses
        ttl (datetime.timedelta): TTL when the cached
            responses are valid.
    """
    def __init__(
            self, 
            ttl: timedelta = timedelta(minutes=10)
        ) -> None:
        self.ttl = ttl
        self.__cached__: dict[str, dict] = {}

    def __getitem__(self, key: str) -> dict:
        """
        Returns a response from the cache in case
        the timestamp is less than the TTL. Otherwise,
        returns an empty dictionary.
        """
        record = self.__cached__.get(key, {})
        current_timestamp: datetime = datetime.now()
        if not record:
            return record
        
        content_timestamp = record["timestamp"]
        is_valid = (current_timestamp - content_timestamp) < self.ttl
        if not is_valid:
            _ = self.__cached__.pop(key)
            return {}
        return record["content"]

    def __setitem__(self, key: str, value: dict) -> None:
        """
        Includes a response into the cache and creates
        a timestamp for it.
        """
        current_timestamp: datetime = datetime.now()
        record = {
            "timestamp": current_timestamp,
            "content": value
        }
        self.__cached__[key] = record
