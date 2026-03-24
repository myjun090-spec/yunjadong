@echo off
chcp 65001 >nul
echo 네이버 블로그 자동 글쓰기
echo ========================
if not exist "venv" python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
python blog_auto.py
pause
