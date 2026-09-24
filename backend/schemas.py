class PredictionInputSchema:
    @staticmethod
    def validate(data):
        errors = []
        if not data:
            return False, ["No JSON input payload provided"]
            
        required_fields = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active']
        for field in required_fields:
            if field not in data or data[field] is None:
                errors.append(f"Missing required field: '{field}'")
                
        if errors:
            return False, errors
            
        try:
            age = float(data['age'])
            gender = int(data['gender'])
            height = float(data['height'])
            weight = float(data['weight'])
            ap_hi = int(data['ap_hi'])
            ap_lo = int(data['ap_lo'])
            cholesterol = int(data['cholesterol'])
            gluc = int(data['gluc'])
            smoke = int(data['smoke'])
            alco = int(data['alco'])
            active = int(data['active'])
            
            if age < 1 or age > 120:
                errors.append("Age must be between 1 and 120 years")
            if gender not in [1, 2]:
                errors.append("Gender must be 1 (Female) or 2 (Male)")
            if height < 50 or height > 250:
                errors.append("Height must be between 50 cm and 250 cm")
            if weight < 20 or weight > 300:
                errors.append("Weight must be between 20 kg and 300 kg")
            if ap_hi < 50 or ap_hi > 300:
                errors.append("Systolic blood pressure (ap_hi) must be between 50 and 300")
            if ap_lo < 30 or ap_lo > 200:
                errors.append("Diastolic blood pressure (ap_lo) must be between 30 and 200")
            if cholesterol not in [1, 2, 3]:
                errors.append("Cholesterol level must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)")
            if gluc not in [1, 2, 3]:
                errors.append("Glucose level must be 1 (Normal), 2 (Above Normal), or 3 (Well Above Normal)")
            if smoke not in [0, 1]:
                errors.append("Smoke must be 0 or 1")
            if alco not in [0, 1]:
                errors.append("Alcohol must be 0 or 1")
            if active not in [0, 1]:
                errors.append("Active must be 0 or 1")
                
        except (ValueError, TypeError) as e:
            errors.append(f"Invalid field data type: {str(e)}")
            
        if errors:
            return False, errors
        return True, None
