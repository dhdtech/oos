import redis
import uuid
from typing import Union

def get_redis_client() -> redis.Redis:
    """
    Returns a redis client.

    :return: Redis client
    :rtype: redis.Redis
    """
    return redis.Redis(host='redis', port=6379, db=0)

def store_secret_in_redis_with_ttl(
        secret_id: uuid.uuid5,
        secret_value: str,
        ttl: int = 24
) -> bool:
    """
    Creates a secret with a fixed time to live.

    :param secret_id: Secret identification
    :type secret_id: str
    :param secret_value: Secret value
    :type secret_value: str

    :return: True if the secret was created, False otherwise
    :rtype: bool
    """
    ttl = ttl * 60 * 60
    try:
        redis_client = get_redis_client()
        redis_client.set(secret_id, secret_value, ex=ttl)
        return True
    except redis.exceptions.ConnectionError:
        return False
    
def retrieve_and_delete_secret_by_id(
        secret_id: uuid.uuid5
) -> Union[str,None]:
    """
    Retrieves and deletes a secret by id.

    :param secret_id: Secret identification
    :type secret_id: str

    :return: Secret value
    :rtype: str
    """
    redis_client = get_redis_client()
    secret_value = redis_client.get(secret_id)

    if secret_value is None:
        return None

    redis_client.delete(secret_id)

    # Ensure we only return the secret value if it was deleted
    assert redis_client.get(secret_id) is None

    return secret_value.decode()
