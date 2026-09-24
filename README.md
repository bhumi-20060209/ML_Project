# 🫀 CardioAI - Cardiovascular Disease Prediction System

A modern, production-ready Clinical Web Application for Cardiovascular Disease Risk Assessment, featuring a **React (Vite + Tailwind CSS)** frontend, **Flask REST API**, **SQLite + SQLAlchemy** database, and **Scikit-learn / Joblib** machine learning inference pipeline.

---

## 📌 Project Overview
CardioAI provides real-time clinical prediction and population health analytics using machine learning models trained on 70,000 patient records from `cardio_train.csv`. 

> **Important Note:** The original research notebook `Cardio_Pandas.ipynb` is kept **READ-ONLY** and untouched as per final academic requirements.

---

## ✨ Features
1. **Clinical Risk Predictor**: Live evaluation of age, gender, height, weight, blood pressure (`ap_hi`/`ap_lo`), cholesterol, glucose, smoking, alcohol, and physical activity.
2. **Real-time ML Inference**: Backend inference powered by `RandomForestClassifier` loaded via `joblib`.
3. **SQLite Database Persistence**: Automatic logging of all patient predictions into SQLite database (`cardio.db`).
4. **Interactive Dashboard**: Key performance metrics, risk breakdown, recent predictions table, and system health status.
5. **Model Registry & Performance**: Side-by-side metric comparison (Accuracy, Precision, Recall, F1, ROC-AUC) across Random Forest, Gradient Boosting, Decision Tree, and Logistic Regression.
6. **Population Analytics**: Epidemiological graphs for Age, Gender, Blood Pressure categories, and Lifestyle risk factors using Recharts.
7. **Prediction History**: Searchable, paginated log of past predictions with detailed view modal and delete confirmation.
8. **Dataset Explorer**: Safe read-only inspection of dataset columns, sample data, and descriptive statistics without modifying `cardio_train.csv`.
9. **Authentication**: User registration and login with secure password hashing (`Werkzeug`).

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Recharts, Lucide Icons.
- **Backend**: Python 3.13, Flask, Flask-CORS, SQLAlchemy, SQLite, Pandas, NumPy, Scikit-learn, Joblib.
- **Database**: SQLite (`backend/instance/cardio.db`).

---

## 📂 Project Structure
```
cardio_ml_project/
│
├── Cardio_Pandas.ipynb         # READ-ONLY final academic notebook
│
├── dataset/
│   └── cardio_train.csv        # Cardiovascular dataset
│
├── backend/
│   ├── app.py                  # Flask Application entry point
│   ├── config.py               # Configuration & paths
│   ├── database.py             # SQLAlchemy instance
│   ├── models.py               # Database schemas (User, Prediction, ModelMetadata)
│   ├── schemas.py              # Input validation
│   ├── requirements.txt        # Python dependencies
│   ├── routes/                 # REST API routes (Auth, Prediction, Dashboard, Models, Analytics, History, Dataset)
│   ├── services/               # Core business & ML inference services
│   ├── ml/
│   │   ├── model_loader.py     # Joblib model loader
│   │   ├── preprocessing.py    # Feature calculation & BMI
│   │   ├── train_and_save_artifacts.py
│   │   └── model_artifacts/   # Trained model.pkl, scaler.pkl, encoder.pkl
│   └── instance/
│       └── cardio.db           # SQLite database
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/api.js          # Centralized Axios API service
│       ├── components/         # Reusable UI components (Sidebar, Header, StatCard, etc.)
│       ├── pages/              # Dashboard, Prediction, Models, Analytics, History, Dataset, Settings, Login
│       ├── context/            # AuthContext
│       └── styles/             # Tailwind CSS & Dashboard styles
│
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Backend Setup (Flask)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run ML Artifact Generator (if artifacts do not exist)
python ml/train_and_save_artifacts.py

# Start Flask Backend Server
python app.py
```
*Backend runs locally at `http://localhost:5000`.*

### 2. Frontend Setup (React + Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite Development Server
npm run dev
```
*Frontend runs locally at `http://localhost:5173`.*

---

## 🔌 Key REST API Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | Register new clinician account |
| **Auth** | `/api/auth/login` | `POST` | Authenticate user credentials |
| **Dashboard** | `/api/dashboard/stats` | `GET` | Get total counts, accuracy & health status |
| **Prediction** | `/api/predictions/predict` | `POST` | Run ML inference & save result to SQLite |
| **History** | `/api/predictions/history` | `GET` | Paginated & filtered prediction history |
| **History** | `/api/predictions/history/<id>` | `DELETE` | Delete prediction record |
| **Models** | `/api/models` | `GET` | Retrieve model evaluation metrics |
| **Analytics** | `/api/analytics/overview` | `GET` | Population health risk statistics |
| **Dataset** | `/api/dataset/summary` | `GET` | Dataset summary and column dictionary |
| **Dataset** | `/api/dataset/sample` | `GET` | Paginated sample rows from CSV |

---

## 🩺 How Prediction Works
1. User submits patient demographics, vitals, and lifestyle choices on the React frontend.
2. React sends payload via `axios` to `POST /api/predictions/predict`.
3. Backend validates parameters using `PredictionInputSchema`.
4. Feature preprocessing formats age to days (`age_years * 365.25`) and calculates BMI (`weight / height^2`).
5. `ModelLoader` loads `model.pkl` with `joblib` and computes prediction class & probability.
6. Result is persisted in SQLite `predictions` table and returned to React to display risk gauge, confidence score, and recommendations.

---

## 🛡️ License & Academic Disclaimer
This system is developed for educational and demonstration purposes. Prediction outputs are not intended as official medical diagnoses. `Cardio_Pandas.ipynb` is kept read-only as the final academic reference.
