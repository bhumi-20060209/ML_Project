from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    predictions = db.relationship('Prediction', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    age = db.Column(db.Integer, nullable=False)  # in years or days as recorded
    gender = db.Column(db.Integer, nullable=False)  # 1: female, 2: male
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    ap_hi = db.Column(db.Integer, nullable=False)
    ap_lo = db.Column(db.Integer, nullable=False)
    cholesterol = db.Column(db.Integer, nullable=False)
    gluc = db.Column(db.Integer, nullable=False)
    smoke = db.Column(db.Integer, nullable=False)
    alco = db.Column(db.Integer, nullable=False)
    active = db.Column(db.Integer, nullable=False)
    bmi = db.Column(db.Float, nullable=False)
    prediction = db.Column(db.Integer, nullable=False)  # 0 or 1
    probability = db.Column(db.Float, nullable=False)  # float 0.0 - 1.0
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "age": self.age,
            "gender": "Female" if self.gender == 1 else "Male",
            "gender_code": self.gender,
            "height": self.height,
            "weight": self.weight,
            "ap_hi": self.ap_hi,
            "ap_lo": self.ap_lo,
            "cholesterol": self.cholesterol,
            "gluc": self.gluc,
            "smoke": self.smoke,
            "alco": self.alco,
            "active": self.active,
            "bmi": round(self.bmi, 2),
            "prediction": self.prediction,
            "probability": round(self.probability, 4),
            "risk_label": "High Risk" if self.prediction == 1 else "Low Risk",
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }

class ModelMetadata(db.Model):
    __tablename__ = 'model_metadata'

    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(100), nullable=False)
    algorithm = db.Column(db.String(100), nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    precision = db.Column(db.Float, nullable=False)
    recall = db.Column(db.Float, nullable=False)
    f1_score = db.Column(db.Float, nullable=False)
    roc_auc = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "model_name": self.model_name,
            "algorithm": self.algorithm,
            "accuracy": round(self.accuracy, 4),
            "precision": round(self.precision, 4),
            "recall": round(self.recall, 4),
            "f1_score": round(self.f1_score, 4),
            "roc_auc": round(self.roc_auc, 4),
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }

class DatasetMetadata(db.Model):
    __tablename__ = 'dataset_metadata'

    id = db.Column(db.Integer, primary_key=True)
    dataset_name = db.Column(db.String(100), nullable=False)
    total_rows = db.Column(db.Integer, nullable=False)
    total_columns = db.Column(db.Integer, nullable=False)
    target_column = db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "dataset_name": self.dataset_name,
            "total_rows": self.total_rows,
            "total_columns": self.total_columns,
            "target_column": self.target_column,
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S") if self.updated_at else None
        }
