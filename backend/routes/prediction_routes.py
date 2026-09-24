from flask import Blueprint, request, jsonify
from schemas import PredictionInputSchema
from services.prediction_service import PredictionService

prediction_bp = Blueprint('predictions', __name__, url_prefix='/api/predictions')

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    
    # Validation
    is_valid, errors = PredictionInputSchema.validate(data)
    if not is_valid:
        return jsonify({"error": "Validation Error", "details": errors}), 400

    try:
        user_id = data.get('user_id', None)
        result = PredictionService.run_prediction(data, user_id=user_id)
        return jsonify({
            "message": "Prediction generated successfully",
            "data": result
        }), 200
    except Exception as e:
        return jsonify({"error": "Prediction Model Error", "details": str(e)}), 500
