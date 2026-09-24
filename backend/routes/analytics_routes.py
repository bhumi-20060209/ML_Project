from flask import Blueprint, jsonify
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('/overview', methods=['GET'])
def get_overview():
    return jsonify(AnalyticsService.get_overview()), 200

@analytics_bp.route('/age-distribution', methods=['GET'])
def get_age_distribution():
    return jsonify({"data": AnalyticsService.get_age_distribution()}), 200

@analytics_bp.route('/gender-distribution', methods=['GET'])
def get_gender_distribution():
    return jsonify({"data": AnalyticsService.get_gender_distribution()}), 200

@analytics_bp.route('/prediction-distribution', methods=['GET'])
def get_prediction_distribution():
    return jsonify({"data": AnalyticsService.get_prediction_distribution()}), 200

@analytics_bp.route('/bp-distribution', methods=['GET'])
def get_bp_distribution():
    return jsonify({"data": AnalyticsService.get_bp_distribution()}), 200

@analytics_bp.route('/lifestyle-distribution', methods=['GET'])
def get_lifestyle_distribution():
    return jsonify({"data": AnalyticsService.get_lifestyle_distribution()}), 200
