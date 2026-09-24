import sys
import os
import pandas as pd
import numpy as np
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import db
from models import Prediction
from config import Config

class AnalyticsService:
    @staticmethod
    def _get_combined_dataframe():
        """
        Combines historical predictions in SQLite with the main dataset for rich analytics!
        """
        df_csv = pd.read_csv(Config.DATASET_PATH, sep=";")
        df_csv['age_years'] = (df_csv['age'] / 365.25).round(1)
        df_csv['bmi'] = (df_csv['weight'] / ((df_csv['height'] / 100) ** 2)).round(1)
        df_csv['source'] = 'Dataset'
        return df_csv

    @staticmethod
    def get_overview():
        preds = Prediction.query.all()
        total_preds = len(preds)
        high_risk_preds = len([p for p in preds if p.prediction == 1])
        low_risk_preds = total_preds - high_risk_preds
        avg_prob = np.mean([p.probability for p in preds]) if total_preds > 0 else 0.50
        
        df_csv = pd.read_csv(Config.DATASET_PATH, sep=";")
        total_dataset_records = len(df_csv)
        dataset_high_risk = int((df_csv['cardio'] == 1).sum())
        dataset_low_risk = total_dataset_records - dataset_high_risk
        
        return {
            "total_user_predictions": total_preds,
            "high_risk_predictions": high_risk_preds,
            "low_risk_predictions": low_risk_preds,
            "average_probability": round(float(avg_prob), 4),
            "dataset_total_records": total_dataset_records,
            "dataset_high_risk_count": dataset_high_risk,
            "dataset_low_risk_count": dataset_low_risk,
            "overall_disease_rate": round(float(dataset_high_risk / total_dataset_records * 100), 2)
        }

    @staticmethod
    def get_age_distribution():
        df = AnalyticsService._get_combined_dataframe()
        
        bins = [0, 40, 50, 60, 100]
        labels = ['<40', '40-49', '50-59', '60+']
        df['age_group'] = pd.cut(df['age_years'], bins=bins, labels=labels, right=False)
        
        grouped = df.groupby(['age_group', 'cardio'], observed=False).size().unstack(fill_value=0)
        
        res = []
        for group in labels:
            low = int(grouped.loc[group, 0]) if 0 in grouped.columns else 0
            high = int(grouped.loc[group, 1]) if 1 in grouped.columns else 0
            res.append({
                "age_group": group,
                "low_risk": low,
                "high_risk": high,
                "total": low + high
            })
        return res

    @staticmethod
    def get_gender_distribution():
        df = AnalyticsService._get_combined_dataframe()
        grouped = df.groupby(['gender', 'cardio']).size().unstack(fill_value=0)
        
        # 1: female, 2: male
        return [
            {
                "gender": "Female",
                "low_risk": int(grouped.loc[1, 0]) if 1 in grouped.index and 0 in grouped.columns else 0,
                "high_risk": int(grouped.loc[1, 1]) if 1 in grouped.index and 1 in grouped.columns else 0
            },
            {
                "gender": "Male",
                "low_risk": int(grouped.loc[2, 0]) if 2 in grouped.index and 0 in grouped.columns else 0,
                "high_risk": int(grouped.loc[2, 1]) if 2 in grouped.index and 1 in grouped.columns else 0
            }
        ]

    @staticmethod
    def get_prediction_distribution():
        df = AnalyticsService._get_combined_dataframe()
        counts = df['cardio'].value_counts()
        return [
            {"name": "Low Risk (Healthy)", "value": int(counts.get(0, 0)), "color": "#10b981"},
            {"name": "High Risk (Cardio Disease)", "value": int(counts.get(1, 0)), "color": "#f43f5e"}
        ]

    @staticmethod
    def get_bp_distribution():
        df = AnalyticsService._get_combined_dataframe()
        
        # Clean extreme BP outliers for smooth visualization chart
        df_clean = df[(df['ap_hi'] >= 70) & (df['ap_hi'] <= 220) & (df['ap_lo'] >= 40) & (df['ap_lo'] <= 140)]
        
        def categorize_bp(row):
            hi = row['ap_hi']
            lo = row['ap_lo']
            if hi < 120 and lo < 80:
                return "Normal"
            elif 120 <= hi <= 129 and lo < 80:
                return "Elevated"
            elif 130 <= hi <= 139 or 80 <= lo <= 89:
                return "Hypertension Stg 1"
            else:
                return "Hypertension Stg 2"
                
        df_clean['bp_category'] = df_clean.apply(categorize_bp, axis=1)
        grouped = df_clean.groupby(['bp_category', 'cardio']).size().unstack(fill_value=0)
        
        categories = ["Normal", "Elevated", "Hypertension Stg 1", "Hypertension Stg 2"]
        res = []
        for cat in categories:
            low = int(grouped.loc[cat, 0]) if cat in grouped.index and 0 in grouped.columns else 0
            high = int(grouped.loc[cat, 1]) if cat in grouped.index and 1 in grouped.columns else 0
            res.append({
                "category": cat,
                "low_risk": low,
                "high_risk": high,
                "risk_rate": round(high / (low + high) * 100, 1) if (low + high) > 0 else 0
            })
        return res

    @staticmethod
    def get_lifestyle_distribution():
        df = AnalyticsService._get_combined_dataframe()
        
        smoke_rate = df.groupby('smoke')['cardio'].mean().to_dict()
        alco_rate = df.groupby('alco')['cardio'].mean().to_dict()
        active_rate = df.groupby('active')['cardio'].mean().to_dict()
        
        return [
            {"factor": "Smoking", "group": "Smoker", "disease_rate": round(smoke_rate.get(1, 0) * 100, 1)},
            {"factor": "Smoking", "group": "Non-Smoker", "disease_rate": round(smoke_rate.get(0, 0) * 100, 1)},
            {"factor": "Alcohol", "group": "Drinks Alcohol", "disease_rate": round(alco_rate.get(1, 0) * 100, 1)},
            {"factor": "Alcohol", "group": "No Alcohol", "disease_rate": round(alco_rate.get(0, 0) * 100, 1)},
            {"factor": "Physical Activity", "group": "Physically Active", "disease_rate": round(active_rate.get(1, 0) * 100, 1)},
            {"factor": "Physical Activity", "group": "Inactive", "disease_rate": round(active_rate.get(0, 0) * 100, 1)}
        ]
