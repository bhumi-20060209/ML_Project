import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

def train_and_export():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.abspath(os.path.join(current_dir, ".."))
    project_root = os.path.abspath(os.path.join(backend_dir, ".."))
    
    dataset_path = os.path.join(project_root, "dataset", "cardio_train.csv")
    if not os.path.exists(dataset_path):
        dataset_path = os.path.join(project_root, "cardio_train.csv")
        
    print(f"Loading dataset from: {dataset_path}")
    df = pd.read_csv(dataset_path, sep=";")
    
    feature_cols = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
    X = df[feature_cols]
    y = df['cardio']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Fit Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Dummy / Identity encoder dictionary for categorical features
    encoder = {
        "gender": {1: "Female", 2: "Male"},
        "cholesterol": {1: "Normal", 2: "Above Normal", 3: "Well Above Normal"},
        "gluc": {1: "Normal", 2: "Above Normal", 3: "Well Above Normal"},
        "smoke": {0: "Non-Smoker", 1: "Smoker"},
        "alco": {0: "No Alcohol", 1: "Consumes Alcohol"},
        "active": {0: "Inactive", 1: "Physically Active"}
    }
    
    # Define models
    models_to_train = {
        "Random Forest Classifier": (RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1), False),
        "Gradient Boosting Classifier": (GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42), False),
        "Decision Tree Classifier": (DecisionTreeClassifier(max_depth=10, random_state=42), False),
        "Logistic Regression": (LogisticRegression(max_iter=1000, random_state=42), True)
    }
    
    trained_metrics = []
    best_rf_model = None
    
    for name, (clf, use_scaling) in models_to_train.items():
        X_tr = X_train_scaled if use_scaling else X_train
        X_te = X_test_scaled if use_scaling else X_test
        
        clf.fit(X_tr, y_train)
        y_pred = clf.predict(X_te)
        y_proba = clf.predict_proba(X_te)[:, 1] if hasattr(clf, "predict_proba") else y_pred
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred))
        rec = float(recall_score(y_test, y_pred))
        f1 = float(f1_score(y_test, y_pred))
        roc = float(roc_auc_score(y_test, y_proba))
        
        trained_metrics.append({
            "model_name": name,
            "algorithm": name.split()[0],
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc
        })
        
        if name == "Random Forest Classifier":
            best_rf_model = clf
            
        print(f"Model: {name} | Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {roc:.4f}")
        
    artifacts_dir = os.path.join(current_dir, "model_artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    
    model_file = os.path.join(artifacts_dir, "model.pkl")
    scaler_file = os.path.join(artifacts_dir, "scaler.pkl")
    encoder_file = os.path.join(artifacts_dir, "encoder.pkl")
    metrics_file = os.path.join(artifacts_dir, "model_metrics.json")
    
    joblib.dump(best_rf_model, model_file)
    joblib.dump(scaler, scaler_file)
    joblib.dump(encoder, encoder_file)
    
    import json
    with open(metrics_file, "w") as f:
        json.dump(trained_metrics, f, indent=2)
        
    print(f"Successfully saved model artifacts to {artifacts_dir}")
    return trained_metrics

if __name__ == "__main__":
    train_and_export()
