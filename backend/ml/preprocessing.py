import pandas as pd
import numpy as np

def prepare_input_dataframe(data):
    """
    Prepares input dictionary into pandas DataFrame with exact column format expected by model.
    Age in input is passed in years (e.g. 50), which is converted to days (50 * 365.25 = 18262.5)
    to align with the original cardio_train.csv dataset format.
    """
    age_days = float(data['age']) * 365.25 if float(data['age']) < 200 else float(data['age'])
    
    df_dict = {
        'age': [age_days],
        'gender': [int(data['gender'])],
        'height': [float(data['height'])],
        'weight': [float(data['weight'])],
        'ap_hi': [int(data['ap_hi'])],
        'ap_lo': [int(data['ap_lo'])],
        'cholesterol': [int(data['cholesterol'])],
        'gluc': [int(data['gluc'])],
        'smoke': [int(data['smoke'])],
        'alco': [int(data['alco'])],
        'active': [int(data['active'])]
    }
    
    columns = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
    df = pd.DataFrame(df_dict)[columns]
    return df

def calculate_bmi(height_cm, weight_kg):
    if height_cm <= 0:
        return 0.0
    return weight_kg / ((height_cm / 100.0) ** 2)
