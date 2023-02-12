import connexion
import six
from typing import Dict
from typing import Tuple
from typing import Union

from api.objects.get_health200_response import GetHealth200Response  # noqa: E501
from api import util


def get_health():  # noqa: E501
    """Health

    Indicates if the service is up and ready to serve requests. # noqa: E501


    :rtype: Union[GetHealth200Response, Tuple[GetHealth200Response, int], Tuple[GetHealth200Response, int, Dict[str, str]]
    """
    return 'do some magic!'

