from flask import Blueprint, jsonify
from services.model_service import ModelService

model_bp = Blueprint('models', __name__, url_prefix='/api/models')

@model_bp.route('', methods=['GET'])
def get_models():
    models_data = ModelService.seed_or_get_models()
    return jsonify({
        "models": models_data,
        "primary_active_model": "Random Forest Classifier"
    }), 200

@model_bp.route('/<int:model_id>', methods=['GET'])
def get_model_detail(model_id):
    model = ModelService.get_model_by_id(model_id)
    if not model:
        return jsonify({"error": "Model metadata not found"}), 404
    return jsonify({"data": model}), 200
