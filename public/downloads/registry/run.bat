@echo off
chcp 65001 >nul
echo 등기부등본 자동 발급
echo ===================
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python registry_auto.py
pause
