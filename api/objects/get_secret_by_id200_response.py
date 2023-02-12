# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from api.objects.base_model_ import Model
from api import util


class GetSecretById200Response(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, secret_value=None):  # noqa: E501
        """GetSecretById200Response - a model defined in OpenAPI

        :param secret_value: The secret_value of this GetSecretById200Response.  # noqa: E501
        :type secret_value: str
        """
        self.openapi_types = {
            'secret_value': str
        }

        self.attribute_map = {
            'secret_value': 'secret_value'
        }

        self._secret_value = secret_value

    @classmethod
    def from_dict(cls, dikt) -> 'GetSecretById200Response':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The get_secret_by_id_200_response of this GetSecretById200Response.  # noqa: E501
        :rtype: GetSecretById200Response
        """
        return util.deserialize_model(dikt, cls)

    @property
    def secret_value(self):
        """Gets the secret_value of this GetSecretById200Response.

        The secret value shared.  # noqa: E501

        :return: The secret_value of this GetSecretById200Response.
        :rtype: str
        """
        return self._secret_value

    @secret_value.setter
    def secret_value(self, secret_value):
        """Sets the secret_value of this GetSecretById200Response.

        The secret value shared.  # noqa: E501

        :param secret_value: The secret_value of this GetSecretById200Response.
        :type secret_value: str
        """
        if secret_value is None:
            raise ValueError("Invalid value for `secret_value`, must not be `None`")  # noqa: E501

        self._secret_value = secret_value
