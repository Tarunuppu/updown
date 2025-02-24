import os
import mimetypes
from dotenv import load_dotenv
from urllib.parse import quote

from src.extensions.s3 import s3
load_dotenv()
class S3:
    def __init__(self):
        self.s3 = s3
        
    def upload(self, file, file_name):
        try:
            self.s3.upload_fileobj(file, os.getenv('AWS_BUCKET_NAME'), file_name)
            return True
        except Exception as e:
            print(e)
            return False
        
    def delete(self, file_name):
        try:
            self.s3.delete_object(Bucket=os.getenv('AWS_BUCKET_NAME'), Key=file_name)
            return True
        except Exception as e:
            print(e)
            return False
    def get(self, file_name):
        try:
            obj = self.s3.get_object(Bucket=os.getenv('AWS_BUCKET_NAME'), Key=file_name)
            return obj
        except Exception as e:
            print(e)
            return None
    
    def generateSignedUrl(self, path, filename, download=False):
        try:
            encoded_filename = quote(filename)
            action = 'download' if download else 'inline'
            url = self.s3.generate_presigned_url(
                'get_object', 
                Params={
                    'Bucket': os.getenv('AWS_BUCKET_NAME'), 
                    'Key': path, 
                    'ResponseContentDisposition': f'{action}; filename="{encoded_filename}"',
                    'ResponseContentType': self.get_content_type(filename)
                    }, 
                ExpiresIn=os.getenv('AWS_URL_EXPIRATION_TIME'))
            return url
        except Exception as e:
            print(e)
            return None
        
    def get_content_type(self, filename):
        mimetype, _ = mimetypes.guess_type(filename)
        return mimetype or 'application/octet-stream'
