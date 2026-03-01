import boto3
from dotenv import load_dotenv
import os

load_dotenv()

dynamodb = boto3.resource(
    'dynamodb',
    region_name=os.getenv('AWS_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)
table = dynamodb.Table('bharat_ai_repositories')
item = table.get_item(Key={'repo_id': 'repo_275cabda85e14003a6efe37a6efd5301'}).get('Item')
print(item.get('error_message'))
