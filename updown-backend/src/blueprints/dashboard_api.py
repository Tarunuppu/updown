from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

from src.services import DashboardService


dashboard_api = Blueprint('dashboard_api', __name__) # dashboard_api Blueprint


def user_verification(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = DashboardService.check_user(user_id)
        if not user:
            return jsonify({'message': 'unauthorized'}), 401
        return fn(user_id, *args, **kwargs)
    return wrapper



@dashboard_api.route('/list', methods=['GET'])
@user_verification
def list(user_id):
    data = request.args
    sort_by = data.get('sort_by') if data.get('sort_by') else 'created_at'
    sort_order = data.get('sort_order') if data.get('sort_order') else 'asc'
    page_number = int(data.get('page_number')) if data.get('page_number') else 1
    page_limit = int(data.get('page_limit')) if data.get('page_limit') else 10
    return DashboardService.list(user_id, sort_by, sort_order, page_number, page_limit)



@dashboard_api.route('/upload', methods=['POST'])
@user_verification
def upload(user_id):
    files = request.files.getlist("file")
    if not files:
        return jsonify({'message': 'invalid payload'}), 400
    
    for file in files:
        filename = file.filename
        extension = filename.split('.')[-1]

        if extension not in ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'json', 'txt']:
            return jsonify({'message': 'invalid file type'}), 400
        
    return DashboardService.upload(user_id, files)




@dashboard_api.route('/delete', methods=['DELETE'])
@user_verification
def delete(user_id):
    data = request.get_json()
    if not data or not data.get('file_name'):
        return jsonify({'message': 'invalid payload'}), 400
    return DashboardService.delete(user_id, data.get('file_name'))



@dashboard_api.route('/download', methods=['GET'])
@user_verification
def download(user_id):
    data = request.args
    file_name = data.get('file_name')
    if not file_name:
        return jsonify({'message': 'invalid payload'}), 400
    return DashboardService.download(user_id, file_name)
    





