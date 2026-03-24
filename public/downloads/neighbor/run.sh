#!/bin/bash
echo "네이버 블로그 서로이웃 자동 추가"
echo "=============================="
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then echo "Python을 설치해주세요."; exit 1; fi
[ ! -d "venv" ] && $PYTHON -m venv venv
source venv/bin/activate
pip install -r requirements.txt -q
$PYTHON neighbor_auto.py
