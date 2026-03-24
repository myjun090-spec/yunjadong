#!/bin/bash
# 카카오톡 자동화 실행 스크립트 (Mac/Linux)
echo "카카오톡 자동 메시지 발송기"
echo "=========================="

# Python 확인
if command -v python3 &> /dev/null; then
    PYTHON=python3
elif command -v python &> /dev/null; then
    PYTHON=python
else
    echo "Python이 설치되어 있지 않습니다."
    echo "https://www.python.org/downloads/ 에서 설치해주세요."
    exit 1
fi

echo "Python: $($PYTHON --version)"

# 가상환경 생성
if [ ! -d "venv" ]; then
    echo "가상환경을 생성합니다..."
    $PYTHON -m venv venv
fi

# 가상환경 활성화
source venv/bin/activate

# 패키지 설치
echo "패키지를 설치합니다..."
pip install -r requirements.txt -q

# 실행
$PYTHON kakao_auto.py
