from flask import Blueprint, request, jsonify
from services.prediction_service import PredictionService

history_bp = Blueprint('history', __name__, url_prefix='/api/predictions/history')

@history_bp.route('', methods=['GET'])
def get_history():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '', type=str)
    risk_filter = request.args.get('risk', '', type=str)
    user_id = request.args.get('user_id', None, type=int)

    result = PredictionService.get_history(
        user_id=user_id,
        page=page,
        per_page=per_page,
        search=search,
        risk_filter=risk_filter
    )
    return jsonify(result), 200

@history_bp.route('/<int:prediction_id>', methods=['GET'])
def get_prediction_detail(prediction_id):
    pred = PredictionService.get_prediction_by_id(prediction_id)
    if not pred:
        return jsonify({"error": "Prediction record not found"}), 404
    return jsonify({"data": pred}), 200

@history_bp.route('/<int:prediction_id>', methods=['DELETE'])
def delete_prediction(prediction_id):
    success = PredictionService.delete_prediction(prediction_id)
    if not success:
        return jsonify({"error": "Prediction record not found"}), 404
    return jsonify({"message": "Prediction record deleted successfully"}), 200
