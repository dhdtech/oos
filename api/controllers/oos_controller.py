import connexion
import six
from typing import Dict
from typing import Tuple
from typing import Union

from api.objects.create_secret200_response import CreateSecret200Response  # noqa: E501
from api.objects.create_secret_request import CreateSecretRequest  # noqa: E501
from api.objects.get_locale200_response import GetLocale200Response  # noqa: E501
from api.objects.get_locale200_response1 import GetLocale200Response1  # noqa: E501
from api.objects.get_secret_by_id200_response import GetSecretById200Response  # noqa: E501
from api import util
from api import services as oos_services
import uuid



def create_secret(locale, create_secret_request=None):  # noqa: E501
    """

     # noqa: E501

    :param locale: Define language to be used.
    :type locale: str
    :param create_secret_request: Body specification to create a secret.
    :type create_secret_request: dict | bytes

    :rtype: Union[CreateSecret200Response, Tuple[CreateSecret200Response, int], Tuple[CreateSecret200Response, int, Dict[str, str]]
    """
    if connexion.request.is_json:
        create_secret_request = CreateSecretRequest.from_dict(connexion.request.get_json())  # noqa: E501

        encrypted_secret_value, secret_key = oos_services.encrypt_secret_value(
            create_secret_request.secret_value
        )
        secret_id = str(uuid.uuid4())

        if oos_services.store_secret_in_redis_with_ttl(
            secret_id=secret_id,
            secret_value=encrypted_secret_value,
            ttl=24,
        ):
            return CreateSecret200Response(
                secret_id=secret_id,
                recovery_key=secret_key,
                ttl=24,
            ).to_dict(), 200


def get_secret_by_id(secret_id, locale, xnxsoss):    # noqa: E501
    """Secret

    One time retrieval of a secret by id. # noqa: E501

    :param secret_id: Secrete identification
    :type secret_id: str
    :type secret_id: str
    :param locale: Define language to be used.
    :type locale: str
    :param xnxsoss: Base64 encoded decrypt key
    :type xnxsoss: str

    :rtype: Union[GetSecretById200Response, Tuple[GetSecretById200Response, int], Tuple[GetSecretById200Response, int, Dict[str, str]]
    """
    encrypted_secret_value = oos_services.retrieve_and_delete_secret_by_id(
        secret_id=secret_id,
    )

    if encrypted_secret_value is None:
        return 'Not found.', 404
    
    secret_value = oos_services.decrypt_secret_value_with_key(
        key=xnxsoss,
        encrypted_secret_value=encrypted_secret_value,
    )

    return GetSecretById200Response(
        secret_value=secret_value,
        )
def get_locale(locale):  # noqa: E501
    """Internationalization

    Return a list of messages acording with the locale provided in path parameter. # noqa: E501

    :param locale: 
    :type locale: str

    :rtype: Union[GetLocale200Response, Tuple[GetLocale200Response, int], Tuple[GetLocale200Response, int, Dict[str, str]]
    """
    return GetLocale200Response(
        **oos_services.get_text_by_locale(
        locale=locale,
    )
    ).to_dict(), 200
