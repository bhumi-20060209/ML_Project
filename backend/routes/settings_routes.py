from flask import Blueprint, request, jsonify

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

# Mock in-memory settings store for application configuration
app_settings = {
    "app_name": "CardioAI Medical Suite",
    "theme": "dark_modern",
    "model_threshold": 0.50,
    "notifications_enabled": True,
    "risk_alert_level": "High",
    "auto_save_predictions": True,
    "api_version": "v1.0.4"
}

@settings_bp.route('', methods=['GET'])
def get_settings():
    return jsonify({"settings": app_settings}), 200

@settings_bp.route('', methods=['PUT'])
def update_settings():
    data = request.get_json() or {}
    for key, val in data.items():
        if key in app_settings:
            app_settings[key] = val
    return jsonify({
        "message": "Settings updated successfully",
        "settings": app_settings
    }), 200
