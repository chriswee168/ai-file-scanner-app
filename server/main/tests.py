from django.test import TestCase
from server.main.models import AIModelsTable

# Create your tests here.
class ModelDBTestCase(TestCase):
    def setUp(self):
        AIModelsTable.objects.create(model_name="testmodel_1234", model_path="models/testmodel_1234")
    
    def test_obtain_path(self):
        model_obj = AIModelsTable.objects.get(model_name="testmodel_1234")
        model_path = model_obj.model_path
        self.assertEqual(model_path, "models/testmodel_1234")

