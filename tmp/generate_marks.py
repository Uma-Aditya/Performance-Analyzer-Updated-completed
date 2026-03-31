
import os
import sqlite3
import pandas as pd
import random

# Path to DB
db_path = r"c:\Users\PAKKI ADITYA\Downloads\Performance-Analyzer-Updated-main\Performance-Analyzer-Updated-main\backend\performance_analyzer.db"
output_path = r"c:\Users\PAKKI ADITYA\Downloads\Performance-Analyzer-Updated-main\Performance-Analyzer-Updated-main\backend\test_data\subject_marks_test_data.xlsx"

# Connect to DB
conn = sqlite3.connect(db_path)
students = conn.execute("SELECT rollNumber, name FROM students").fetchall()
conn.close()

if not students:
    print("No students found in DB.")
    exit(1)

# Generate Marks
data = []
for roll, name in students:
    # Random marks between 40 and 100
    marks = random.randint(40, 100)
    data.append({
        "Roll Number": roll,
        "Name": name,
        "Score": marks
    })

# Create DataFrame
df = pd.DataFrame(data)

# Ensure directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Write to Excel
df.to_excel(output_path, index=False)
print(f"Successfully generated test marks data for {len(data)} students at {output_path}")
