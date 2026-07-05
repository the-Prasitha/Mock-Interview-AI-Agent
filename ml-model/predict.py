import joblib
import sys
import os

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    BASE_DIR,
    "placement_model.pkl"
)

model = joblib.load(model_path)

technical = int(sys.argv[1])
communication = int(sys.argv[2])
problem_solving = int(sys.argv[3])
behavioral = int(sys.argv[4])

prob = model.predict_proba(
    [[
        technical,
        communication,
        problem_solving,
        behavioral
    ]]
)[0][1]

score = int(prob * 100)

print(score)