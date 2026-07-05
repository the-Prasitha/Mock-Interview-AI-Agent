import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

df = pd.read_csv("placement_data.csv")

X = df[
    [
        "technical",
        "communication",
        "problem_solving",
        "behavioral"
    ]
]

y = df["ready"]

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

joblib.dump(
    model,
    "placement_model.pkl"
)

print("Model trained successfully!")