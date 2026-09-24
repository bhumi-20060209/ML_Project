import os
import joblib
from config import Config

class ModelLoader:
    _instance = None
    _model = None
    _scaler = None
    _encoder = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._load_artifacts()
        return cls._instance

    def _load_artifacts(self):
        try:
            if os.path.exists(Config.MODEL_PATH):
                self._model = joblib.load(Config.MODEL_PATH)
                print(f"[ModelLoader] Loaded model from {Config.MODEL_PATH}")
            else:
                print(f"[ModelLoader] Model file not found at {Config.MODEL_PATH}")

            if os.path.exists(Config.SCALER_PATH):
                self._scaler = joblib.load(Config.SCALER_PATH)
                print(f"[ModelLoader] Loaded scaler from {Config.SCALER_PATH}")
                
            if os.path.exists(Config.ENCODER_PATH):
                self._encoder = joblib.load(Config.ENCODER_PATH)
                print(f"[ModelLoader] Loaded encoder from {Config.ENCODER_PATH}")
        except Exception as e:
            print(f"[ModelLoader] Error loading artifacts: {e}")

    def predict(self, df_input):
        if self._model is None:
            self._load_artifacts()
            if self._model is None:
                raise RuntimeError("ML Model artifact is not available. Please train artifacts first.")
                
        # Run prediction
        prediction = self._model.predict(df_input)[0]
        
        # Run predict_proba if available
        if hasattr(self._model, "predict_proba"):
            probability = float(self._model.predict_proba(df_input)[0][1])
        else:
            probability = float(prediction)

        return int(prediction), round(probability, 4)

    @property
    def model(self):
        return self._model

    @property
    def scaler(self):
        return self._scaler

    @property
    def encoder(self):
        return self._encoder
