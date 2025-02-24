from flask import jsonify, send_file
from io import BytesIO

from src.models import User
from src.models import UserFiles
from src.extensions.sqlalchemy import db 
from .s3 import S3

class DashboardService:
    @staticmethod
    def check_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return False
        return True
    
    @staticmethod
    def list(user_id, sort_by='created_at', sort_order='asc', page_number=1, page_limit=10):
        sort_order_func = getattr(UserFiles, sort_by)
        if sort_order == 'desc':
            sort_order_func = sort_order_func.desc()
        
        query = UserFiles.query.filter_by(user_id=user_id).order_by(sort_order_func)
        paginated_files = query.paginate(page=page_number, per_page=page_limit, error_out=False)
        files = []
        s3_client = S3()
        for file in paginated_files.items:
            download_url = s3_client.generateSignedUrl(f"{user_id}/{file.file_name}", file.file_name, True)
            view_url = s3_client.generateSignedUrl(f"{user_id}/{file.file_name}", file.file_name )
            files.append({
                'id': file.id,
                'file_name': file.file_name,
                'created_at': file.created_at,
                'type': file.file_type,
                'size': f"{file.file_size / 1000:.2f} KB" if file.file_size else '0 KB',
                'view_url' : view_url,
                'download_url': download_url
            })
    
        return jsonify({"total": paginated_files.total, "files": files})

    @staticmethod
    def upload(user_id, files):
        for file in files:
            file_name = file.filename
            file.seek(0, 2)
            file_size = file.tell()
            file.seek(0)
            file_extension = file_name.split('.')[-1] if '.' in file_name else ''
            file_exist = UserFiles.query.filter_by(user_id=user_id, file_name=file_name).first()
            if file_exist:
                base_name, extension = file_name.rsplit('.', 1) if '.' in file_name else (file_name, '')
                count = 1
                while file_exist:
                    modified_file_name = f"{base_name}({count}){'.' + extension if extension else ''}"
                    file_exist = UserFiles.query.filter_by(user_id=user_id, file_name=modified_file_name).first()
                    count += 1
                file_name = modified_file_name

            #uploading file to s3
            s3_client = S3()
            s3_path = f"{user_id}/{file_name}"
            is_uploaded = s3_client.upload(file, s3_path) 
            if not is_uploaded:
                return jsonify({'message': 'internal server error'}), 500
            
            #logging in database
            new_file = UserFiles(user_id, file_name, file_extension, file_size)
            try:
                db.session.add(new_file)
                db.session.commit()
            except Exception as e:
                print(e)
                return jsonify({'message': 'internal server error'}), 500
        return DashboardService.list(user_id)
        


    @staticmethod
    def delete(user_id, file_name):

        file = UserFiles.query.filter_by(user_id=user_id, file_name=file_name).first()
        if not file:
            return jsonify({'message': 'file not found'}), 404
        

        #deleting file from s3
        s3_client = S3()
        is_deleted = s3_client.delete(f"{user_id}/{file_name}")
        if not is_deleted:
            return jsonify({'message': 'internal server error'}), 500
        
        #deleting file from database
        db.session.delete(file)
        db.session.commit()
        return DashboardService.list(user_id)
    
    @staticmethod
    def download(user_id, file_name):
        file = UserFiles.query.filter_by(user_id=user_id, file_name=file_name).first()
        if not file:
            return jsonify({'message': 'file not found'}), 404
        s3_client = S3()
        file_obj = s3_client.get(f"{user_id}/{file_name}")
        if not file_obj:
            return jsonify({'message': 'internal server error'}), 500
        return send_file(
            BytesIO(file_obj['Body'].read()),
            download_name=file_name,
            as_attachment=True
        )
    
