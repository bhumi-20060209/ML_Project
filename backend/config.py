import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "cardio_ai_secret_key_2026_super_secure")
    
    # SQLite Database Configuration
    INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
    os.makedirs(INSTANCE_DIR, exist_ok=True)
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(INSTANCE_DIR, 'cardio.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Paths
    DATASET_PATH = os.path.join(PROJECT_ROOT, "dataset", "cardio_train.csv")
    ARTIFACTS_DIR = os.path.join(BASE_DIR, "ml", "model_artifacts")
    MODEL_PATH = os.path.join(ARTIFACTS_DIR, "model.pkl")
    SCALER_PATH = os.path.join(ARTIFACTS_DIR, "scaler.pkl")
    ENCODER_PATH = os.path.join(ARTIFACTS_DIR, "encoder.pkl")
    
    # CORS
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
