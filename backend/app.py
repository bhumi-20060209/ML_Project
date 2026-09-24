import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database import db
from models import User, Prediction, ModelMetadata, DatasetMetadata

from routes.auth_routes import auth_bp
from routes.prediction_routes import prediction_bp
from routes.history_routes import history_bp
from routes.dashboard_routes import dashboard_bp
from routes.model_routes import model_bp
from routes.analytics_routes import analytics_bp
from routes.dataset_routes import dataset_bp
from routes.settings_routes import settings_bp

from services.model_service import ModelService

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend (http://localhost:5173)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize DB
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(prediction_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(model_bp)
    app.register_blueprint(analytics_bp)
    app.register_blueprint(dataset_bp)
    app.register_blueprint(settings_bp)

    @app.route('/')
    def index():
        return jsonify({
            "service": "CardioAI Medical Backend REST API",
            "version": "1.0.0",
            "status": "Healthy",
            "endpoints": "/api/dashboard/stats, /api/predictions/predict, /api/models, /api/analytics/overview"
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found", "status": 404}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error", "status": 500, "details": str(e)}), 500

    with app.app_context():
        # Create SQLite database tables if not exist
        db.create_all()
        
        # Check if model artifacts exist; if not, train them automatically
        if not os.path.exists(Config.MODEL_PATH):
            print("[Backend Startup] Model artifacts missing. Training ML model on dataset...")
            try:
                from ml.train_and_save_artifacts import train_and_export
                train_and_export()
            except Exception as ex:
                print(f"[Backend Startup] Error training model artifacts: {ex}")
                
        # Seed model metadata & dataset metadata
        ModelService.seed_or_get_models()
        
        # Seed default dataset metadata if missing
        if not DatasetMetadata.query.first():
            import pandas as pd
            if os.path.exists(Config.DATASET_PATH):
                df_temp = pd.read_csv(Config.DATASET_PATH, sep=";")
                ds_meta = DatasetMetadata(
                    dataset_name="cardio_train.csv",
                    total_rows=len(df_temp),
                    total_columns=len(df_temp.columns),
                    target_column="cardio"
                )
                db.session.add(ds_meta)
                db.session.commit()
                
        # Seed demo user if no users exist
        if not User.query.first():
            demo_user = User(name="Dr. Sarah Jenkins", email="sarah.jenkins@cardio.ai")
            demo_user.set_password("cardio123")
            db.session.add(demo_user)
            db.session.commit()

    return app

app = create_app()

if __name__ == '__main__':
    print("Starting CardioAI Flask Server on http://localhost:5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
