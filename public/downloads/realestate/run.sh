#!/bin/bash
echo "부동산 매물 수집 자동화"
echo "======================"
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then echo "Python을 설치해주세요."; exit 1; fi
[ ! -d "venv" ] && $PYTHON -m venv venv
source venv/bin/activate
pip install -r requirements.txt -q
$PYTHON realestate_auto.py
