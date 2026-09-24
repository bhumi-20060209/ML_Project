from flask import Blueprint, request, jsonify
from services.dataset_service import DatasetService

dataset_bp = Blueprint('dataset', __name__, url_prefix='/api/dataset')

@dataset_bp.route('/summary', methods=['GET'])
def get_summary():
    return jsonify(DatasetService.get_summary()), 200

@dataset_bp.route('/columns', methods=['GET'])
def get_columns():
    return jsonify({"columns": DatasetService.get_columns_info()}), 200

@dataset_bp.route('/sample', methods=['GET'])
def get_sample():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 15, type=int)
    return jsonify(DatasetService.get_sample_data(page=page, per_page=per_page)), 200

@dataset_bp.route('/statistics', methods=['GET'])
def get_statistics():
    return jsonify({"statistics": DatasetService.get_statistics()}), 200
