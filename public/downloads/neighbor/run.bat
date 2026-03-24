@echo off
chcp 65001 >nul
echo 네이버 블로그 서로이웃 자동 추가
echo ==============================
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python neighbor_auto.py
pause
