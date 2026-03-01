"""
DynamoDB table initialization and management.
Creates tables if they don't exist on startup.
"""
import boto3
from botocore.exceptions import ClientError
from config import settings
import logging

logger = logging.getLogger(__name__)


import threading

_local = threading.local()

def get_dynamodb_resource():
    if not hasattr(_local, 'dynamodb'):
        session = boto3.session.Session()
        _local.dynamodb = session.resource(
            "dynamodb",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
    return _local.dynamodb


def get_dynamodb_client():
    if not hasattr(_local, 'dynamodb_client'):
        session = boto3.session.Session()
        _local.dynamodb_client = session.client(
            "dynamodb",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
    return _local.dynamodb_client


TABLE_SCHEMAS = [
    {
        "TableName": settings.DYNAMODB_USERS_TABLE,
        "KeySchema": [{"AttributeName": "user_id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "user_id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_REPOS_TABLE,
        "KeySchema": [{"AttributeName": "repo_id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "repo_id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_REPO_INTELLIGENCE_TABLE,
        "KeySchema": [{"AttributeName": "repo_id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "repo_id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_ROADMAPS_TABLE,
        "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_ASSESSMENTS_TABLE,
        "KeySchema": [{"AttributeName": "assessment_id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "assessment_id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_ACTIVITY_LOGS_TABLE,
        "KeySchema": [
            {"AttributeName": "user_id", "KeyType": "HASH"},
            {"AttributeName": "timestamp", "KeyType": "RANGE"},
        ],
        "AttributeDefinitions": [
            {"AttributeName": "user_id", "AttributeType": "S"},
            {"AttributeName": "timestamp", "AttributeType": "S"},
        ],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_PLAYGROUND_SESSIONS_TABLE,
        "KeySchema": [{"AttributeName": "id", "KeyType": "HASH"}],
        "AttributeDefinitions": [{"AttributeName": "id", "AttributeType": "S"}],
        "BillingMode": "PAY_PER_REQUEST",
    },
    {
        "TableName": settings.DYNAMODB_CHAT_MEMORY_TABLE,
        "KeySchema": [
            {"AttributeName": "repo_id", "KeyType": "HASH"},
            {"AttributeName": "message_id", "KeyType": "RANGE"},
        ],
        "AttributeDefinitions": [
            {"AttributeName": "repo_id", "AttributeType": "S"},
            {"AttributeName": "message_id", "AttributeType": "S"},
        ],
        "BillingMode": "PAY_PER_REQUEST",
    },
]


def create_tables_if_not_exist():
    """Create all DynamoDB tables if they don't already exist."""
    client = get_dynamodb_client()
    existing_tables = set()

    try:
        paginator = client.get_paginator("list_tables")
        for page in paginator.paginate():
            existing_tables.update(page.get("TableNames", []))
    except Exception as e:
        logger.warning(f"Could not list DynamoDB tables (offline mode?): {e}")
        return

    for schema in TABLE_SCHEMAS:
        table_name = schema["TableName"]
        if table_name in existing_tables:
            logger.info(f"Table '{table_name}' already exists, skipping.")
            continue
        try:
            client.create_table(**schema)
            logger.info(f"Created DynamoDB table: {table_name}")
        except ClientError as e:
            if e.response["Error"]["Code"] == "ResourceInUseException":
                logger.info(f"Table '{table_name}' already exists (race condition).")
            else:
                logger.error(f"Failed to create table '{table_name}': {e}")
