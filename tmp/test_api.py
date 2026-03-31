
import os
import sys

# Get the directory of main.py
backend_dir = r"c:\Users\PAKKI ADITYA\Downloads\Performance-Analyzer-Updated-main\Performance-Analyzer-Updated-main\backend"
sys.path.append(backend_dir)

import main # Import main.py directly
from main import SessionLocal, Student, StudentAnalyticsProfile, get_all_students

import asyncio

async def test():
    try:
        res = await get_all_students(branch="all", year="all", section="all")
        print("Success, found {} students".format(len(res)))
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
