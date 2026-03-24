@echo off
chcp 65001 >nul
echo 황금 키워드 자동 발굴
echo ====================
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python keyword_auto.py
pause
