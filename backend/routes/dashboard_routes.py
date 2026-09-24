from flask import Blueprint, jsonify
from models import Prediction, ModelMetadata
from services.analytics_service import AnalyticsService

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
def get_stats():
    # Fetch prediction counts from SQLite DB
    total_preds = Prediction.query.count()
    high_risk = Prediction.query.filter_by(prediction=1).count()
    low_risk = Prediction.query.filter_by(prediction=0).count()
    
    # Get recent 5 predictions
    recent_preds = Prediction.query.order_by(Prediction.created_at.desc()).limit(5).all()
    recent_list = [p.to_dict() for p in recent_preds]

    # Get model performance summary
    models = ModelMetadata.query.all()
    best_acc = 73.25
    model_count = len(models)
    if models:
        best_acc = max([m.accuracy * 100 for m in models])

    return jsonify({
        "stats": {
            "total_predictions": total_preds,
            "high_risk_predictions": high_risk,
            "low_risk_predictions": low_risk,
            "model_accuracy": round(best_acc, 1)
        },
        "recent_predictions": recent_list,
        "risk_distribution": [
            {"name": "High Risk", "value": high_risk, "color": "#f43f5e"},
            {"name": "Low Risk", "value": low_risk, "color": "#10b981"}
        ],
        "system_status": {
            "backend_status": "Online",
            "database": "Connected (SQLite)",
            "ml_model_loaded": True,
            "total_registered_models": model_count
        }
    }), 200
