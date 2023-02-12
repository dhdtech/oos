# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from api.objects.get_health200_response import GetHealth200Response  # noqa: E501
from api.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_get_health(self):
        """Test case for get_health

        Health
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/health',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
