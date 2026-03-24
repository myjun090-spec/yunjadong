#!/bin/bash
echo "등기부등본 자동 발급"
echo "==================="
PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then echo "Python을 설치해주세요."; exit 1; fi
[ ! -d "venv" ] && $PYTHON -m venv venv
source venv/bin/activate
pip install -r requirements.txt -q
$PYTHON registry_auto.py
