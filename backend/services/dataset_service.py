import os
import pandas as pd
import numpy as np
from config import Config

class DatasetService:
    @staticmethod
    def get_summary():
        df = pd.read_csv(Config.DATASET_PATH, sep=";")
        return {
            "dataset_name": "cardio_train.csv",
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "target_column": "cardio",
            "file_size_kb": round(os.path.getsize(Config.DATASET_PATH) / 1024, 2),
            "delimiter": ";"
        }

    @staticmethod
    def get_columns_info():
        descriptions = {
            "id": "Unique patient record identifier",
            "age": "Objective feature: Patient age in days",
            "gender": "Categorical feature: 1 = Female, 2 = Male",
            "height": "Objective feature: Height in cm",
            "weight": "Objective feature: Weight in kg",
            "ap_hi": "Examination feature: Systolic blood pressure (mmHg)",
            "ap_lo": "Examination feature: Diastolic blood pressure (mmHg)",
            "cholesterol": "Examination feature: 1 = Normal, 2 = Above Normal, 3 = Well Above Normal",
            "gluc": "Examination feature: 1 = Normal, 2 = Above Normal, 3 = Well Above Normal",
            "smoke": "Subjective feature: 0 = Non-Smoker, 1 = Smoker",
            "alco": "Subjective feature: 0 = No Alcohol, 1 = Consumes Alcohol",
            "active": "Subjective feature: 0 = Inactive, 1 = Physically Active",
            "cardio": "Target variable: 0 = Absence of Cardiovascular Disease, 1 = Presence of Cardiovascular Disease"
        }
        
        df = pd.read_csv(Config.DATASET_PATH, sep=";")
        cols_info = []
        for col in df.columns:
            cols_info.append({
                "name": col,
                "data_type": str(df[col].dtype),
                "description": descriptions.get(col, "Dataset attribute"),
                "sample_values": [int(x) if isinstance(x, (int, np.integer)) else float(x) for x in df[col].head(3).tolist()]
            })
        return cols_info

    @staticmethod
    def get_sample_data(page=1, per_page=15):
        df = pd.read_csv(Config.DATASET_PATH, sep=";")
        total_rows = len(df)
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        sliced_df = df.iloc[start_idx:end_idx].copy()
        sliced_df['age_years'] = (sliced_df['age'] / 365.25).round(1)
        sliced_df['bmi'] = (sliced_df['weight'] / ((sliced_df['height'] / 100) ** 2)).round(1)
        
        records = sliced_df.to_dict(orient="records")
        
        return {
            "data": records,
            "total_rows": total_rows,
            "current_page": page,
            "per_page": per_page,
            "total_pages": int(np.ceil(total_rows / per_page))
        }

    @staticmethod
    def get_statistics():
        df = pd.read_csv(Config.DATASET_PATH, sep=";")
        stats_df = df.describe().T.reset_index()
        stats_df.rename(columns={"index": "feature"}, inplace=True)
        
        records = []
        for _, row in stats_df.iterrows():
            records.append({
                "feature": row['feature'],
                "count": int(row['count']),
                "mean": round(float(row['mean']), 2),
                "std": round(float(row['std']), 2),
                "min": round(float(row['min']), 2),
                "q25": round(float(row['25%']), 2),
                "median": round(float(row['50%']), 2),
                "q75": round(float(row['75%']), 2),
                "max": round(float(row['max']), 2)
            })
        return records
