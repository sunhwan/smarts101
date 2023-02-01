from django.test import TestCase, Client


class ApiSchemaTestCase(TestCase):

    def test_schema_filters(self):
        c = Client()
        response = c.get('/api/schema/')
        response_yaml = response.content.decode('utf-8')
        self.assertFalse('/cms/' in response_yaml)
