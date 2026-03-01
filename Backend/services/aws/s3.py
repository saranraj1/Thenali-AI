"""
Amazon S3 service for file upload/download.
"""
import logging
import uuid
from typing import Optional, BinaryIO

import boto3
from botocore.exceptions import ClientError

from config import settings

logger = logging.getLogger(__name__)


class S3Service:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = boto3.client(
                "s3",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        return self._client

    def upload_file(
        self,
        bucket: str,
        key: str,
        file_obj: BinaryIO,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload file to S3, return the S3 key."""
        try:
            self.client.upload_fileobj(
                file_obj,
                bucket,
                key,
                ExtraArgs={"ContentType": content_type},
            )
            logger.info(f"Uploaded to s3://{bucket}/{key}")
            return key
        except ClientError as e:
            logger.error(f"S3 upload failed: {e}")
            raise RuntimeError(f"S3 upload failed: {e}")

    def upload_bytes(
        self,
        bucket: str,
        key: str,
        data: bytes,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Upload raw bytes to S3."""
        try:
            self.client.put_object(Bucket=bucket, Key=key, Body=data, ContentType=content_type)
            return key
        except ClientError as e:
            logger.error(f"S3 put_object failed: {e}")
            raise RuntimeError(f"S3 put_object failed: {e}")

    def download_bytes(self, bucket: str, key: str) -> bytes:
        """Download an S3 object as bytes."""
        try:
            response = self.client.get_object(Bucket=bucket, Key=key)
            return response["Body"].read()
        except ClientError as e:
            logger.error(f"S3 download failed: {e}")
            raise RuntimeError(f"S3 download failed: {e}")

    def generate_presigned_url(
        self, bucket: str, key: str, expiration: int = 3600
    ) -> str:
        """Generate a presigned download URL."""
        try:
            return self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket, "Key": key},
                ExpiresIn=expiration,
            )
        except ClientError as e:
            logger.error(f"Presigned URL generation failed: {e}")
            raise RuntimeError(f"Presigned URL failed: {e}")

    def ensure_bucket_exists(self, bucket: str):
        """Create bucket if it doesn't exist."""
        try:
            self.client.head_bucket(Bucket=bucket)
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code in ("404", "NoSuchBucket"):
                try:
                    if settings.AWS_REGION == "us-east-1":
                        self.client.create_bucket(Bucket=bucket)
                    else:
                        self.client.create_bucket(
                            Bucket=bucket,
                            CreateBucketConfiguration={
                                "LocationConstraint": settings.AWS_REGION
                            },
                        )
                    logger.info(f"Created S3 bucket: {bucket}")
                except ClientError as ce:
                    logger.warning(f"Could not create bucket '{bucket}': {ce}")


s3_service = S3Service()
