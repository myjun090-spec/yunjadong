@echo off
chcp 65001 >nul
echo 부동산 매물 수집 자동화
echo ======================
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python realestate_auto.py
pause
