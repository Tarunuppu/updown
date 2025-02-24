from src.extensions.sqlalchemy import db
from sqlalchemy import Index, UniqueConstraint

class UserFiles(db.Model):
    __tablename__ = 'user_files'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    file_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(255))
    file_size = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __init__(self, user_id, file_name, file_type, file_size):
        self.user_id = user_id
        self.file_name = file_name
        self.file_type = file_type
        self.file_size = file_size
    
    __table_args__ = (
        UniqueConstraint('user_id', 'file_name', name='uq_user_files_user_id_file_name'),
    )

Index('user_files_user_id_file_name', UserFiles.user_id, UserFiles.file_name)