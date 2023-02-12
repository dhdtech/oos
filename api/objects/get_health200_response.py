# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from api.objects.base_model_ import Model
from api import util


class GetHealth200Response(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, redis=None):  # noqa: E501
        """GetHealth200Response - a model defined in OpenAPI

        :param redis: The redis of this GetHealth200Response.  # noqa: E501
        :type redis: bool
        """
        self.openapi_types = {
            'redis': bool
        }

        self.attribute_map = {
            'redis': 'redis'
        }

        self._redis = redis

    @classmethod
    def from_dict(cls, dikt) -> 'GetHealth200Response':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The get_health_200_response of this GetHealth200Response.  # noqa: E501
        :rtype: GetHealth200Response
        """
        return util.deserialize_model(dikt, cls)

    @property
    def redis(self):
        """Gets the redis of this GetHealth200Response.

        Indicate if redis is reachable or not  # noqa: E501

        :return: The redis of this GetHealth200Response.
        :rtype: bool
        """
        return self._redis

    @redis.setter
    def redis(self, redis):
        """Sets the redis of this GetHealth200Response.

        Indicate if redis is reachable or not  # noqa: E501

        :param redis: The redis of this GetHealth200Response.
        :type redis: bool
        """
        if redis is None:
            raise ValueError("Invalid value for `redis`, must not be `None`")  # noqa: E501

        self._redis = redis
