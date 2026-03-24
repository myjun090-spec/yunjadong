@echo off
chcp 65001 >nul
echo 카카오톡 자동 메시지 발송기
echo ==========================

:: Python 확인
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python이 설치되어 있지 않습니다.
    echo https://www.python.org/downloads/ 에서 설치해주세요.
    pause
    exit /b 1
)

:: 가상환경 생성
if not exist "venv" (
    echo 가상환경을 생성합니다...
    python -m venv venv
)

:: 가상환경 활성화
call venv\Scripts\activate.bat

:: 패키지 설치
echo 패키지를 설치합니다...
pip install -r requirements.txt -q

:: 실행
python kakao_auto.py
pause
