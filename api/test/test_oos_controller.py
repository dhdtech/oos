# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from api.objects.create_secret200_response import CreateSecret200Response  # noqa: E501
from api.objects.create_secret_request import CreateSecretRequest  # noqa: E501
from api.objects.get_secret_by_id200_response import GetSecretById200Response  # noqa: E501
from api.test import BaseTestCase


class TestOosController(BaseTestCase):
    """OosController integration test stubs"""

    def test_create_secret(self):
        """Test case for create_secret

        
        """
        create_secret_request = api.CreateSecretRequest()
        query_string = [('locale', 'pt-br')]
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/secret/',
            method='POST',
            headers=headers,
            data=json.dumps(create_secret_request),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_secret_by_id(self):
        """Test case for get_secret_by_id

        Secret
        """
        query_string = [('locale', 'pt-br')]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/secret/{secret_id}'.format(secret_id='886313e1-3b8a-5372-9b90-0c9aee199e5d'),
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
