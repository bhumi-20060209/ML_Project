import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import db
from models import Prediction
from ml.preprocessing import prepare_input_dataframe, calculate_bmi
from ml.model_loader import ModelLoader

class PredictionService:
    @staticmethod
    def run_prediction(data, user_id=None):
        # 1. Prepare Dataframe
        df_input = prepare_input_dataframe(data)
        
        # 2. Calculate BMI
        bmi = calculate_bmi(float(data['height']), float(data['weight']))
        
        # 3. Model Inference via joblib loader
        loader = ModelLoader.get_instance()
        pred_class, probability = loader.predict(df_input)
        
        # 4. Save to SQLite database
        prediction_record = Prediction(
            user_id=user_id,
            age=int(data['age']),
            gender=int(data['gender']),
            height=float(data['height']),
            weight=float(data['weight']),
            ap_hi=int(data['ap_hi']),
            ap_lo=int(data['ap_lo']),
            cholesterol=int(data['cholesterol']),
            gluc=int(data['gluc']),
            smoke=int(data['smoke']),
            alco=int(data['alco']),
            active=int(data['active']),
            bmi=bmi,
            prediction=pred_class,
            probability=probability
        )
        
        db.session.add(prediction_record)
        db.session.commit()
        
        result_dict = prediction_record.to_dict()
        result_dict["model_used"] = "Random Forest Classifier (CardioAI v1.0)"
        return result_dict

    @staticmethod
    def get_history(user_id=None, page=1, per_page=10, search=None, risk_filter=None):
        query = Prediction.query
        if user_id:
            query = query.filter_by(user_id=user_id)
            
        if risk_filter is not None and risk_filter != "":
            if risk_filter.lower() == "high":
                query = query.filter_by(prediction=1)
            elif risk_filter.lower() == "low":
                query = query.filter_by(prediction=0)

        query = query.order_by(Prediction.created_at.desc())
        
        paginated = query.paginate(page=page, per_page=per_page, error_out=False)
        items = [p.to_dict() for p in paginated.items]
        
        return {
            "predictions": items,
            "total": paginated.total,
            "pages": paginated.pages,
            "current_page": paginated.page,
            "per_page": per_page
        }

    @staticmethod
    def get_prediction_by_id(prediction_id):
        pred = Prediction.query.get(prediction_id)
        return pred.to_dict() if pred else None

    @staticmethod
    def delete_prediction(prediction_id):
        pred = Prediction.query.get(prediction_id)
        if not pred:
            return False
        db.session.delete(pred)
        db.session.commit()
        return True
