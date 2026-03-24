#!/usr/bin/env python3
"""
카카오톡 자동 메시지 발송기
- 지정된 대화방에 메시지를 자동으로 전송합니다.
- Windows: 카카오톡 PC 앱 제어 (pyautogui)
- Mac: 카카오톡 Mac 앱 제어 (pyautogui)

사용법:
  1. pip install -r requirements.txt
  2. 카카오톡 PC/Mac 앱에 로그인
  3. python kakao_auto.py
"""

import sys
import time
import platform
import json
import os
from pathlib import Path

try:
    import pyautogui
    import pyperclip
except ImportError:
    print("필요한 패키지를 설치합니다...")
    os.system(f"{sys.executable} -m pip install pyautogui pyperclip")
    import pyautogui
    import pyperclip

# 설정 파일 경로
CONFIG_FILE = Path(__file__).parent / "config.json"
DEFAULT_CONFIG = {
    "rooms": ["홍보 단톡방 1", "홍보 단톡방 2"],
    "message": "안녕하세요! 자동 메시지입니다.",
    "interval_minutes": 5,
    "repeat": True
}

IS_MAC = platform.system() == "Darwin"
IS_WIN = platform.system() == "Windows"


def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        save_config(DEFAULT_CONFIG)
        print(f"설정 파일이 생성되었습니다: {CONFIG_FILE}")
        print("config.json을 수정한 후 다시 실행해주세요.")
        return DEFAULT_CONFIG


def save_config(config):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def open_kakao_chat(room_name: str):
    """카카오톡에서 대화방을 검색하고 엽니다."""
    pyautogui.hotkey("command" if IS_MAC else "ctrl", "f")
    time.sleep(0.5)

    # 검색창 비우기
    pyautogui.hotkey("command" if IS_MAC else "ctrl", "a")
    time.sleep(0.1)

    # 대화방 이름 입력
    pyperclip.copy(room_name)
    pyautogui.hotkey("command" if IS_MAC else "ctrl", "v")
    time.sleep(1)

    # Enter로 대화방 진입
    pyautogui.press("enter")
    time.sleep(0.5)


def send_message(message: str):
    """현재 열린 대화방에 메시지를 전송합니다."""
    pyperclip.copy(message)
    pyautogui.hotkey("command" if IS_MAC else "ctrl", "v")
    time.sleep(0.3)
    pyautogui.press("enter")
    time.sleep(0.3)


def activate_kakao():
    """카카오톡 윈도우를 활성화합니다."""
    if IS_MAC:
        os.system("open -a KakaoTalk")
    elif IS_WIN:
        try:
            import subprocess
            subprocess.run(["powershell", "-Command",
                          '(New-Object -ComObject WScript.Shell).AppActivate("카카오톡")'],
                         capture_output=True)
        except Exception:
            pass
    time.sleep(1)


def run_automation(config: dict):
    """자동화 메인 루프"""
    rooms = config["rooms"]
    message = config["message"]
    interval = config["interval_minutes"]
    repeat = config["repeat"]

    print(f"\n{'='*50}")
    print(f"카카오톡 자동 메시지 발송기")
    print(f"{'='*50}")
    print(f"대상 대화방: {', '.join(rooms)}")
    print(f"메시지: {message[:50]}...")
    print(f"전송 간격: {interval}분")
    print(f"반복 여부: {'예' if repeat else '아니오'}")
    print(f"{'='*50}")
    print(f"\n3초 후 시작됩니다. 중단하려면 Ctrl+C를 누르세요...")
    time.sleep(3)

    cycle = 1
    while True:
        print(f"\n--- 전송 사이클 #{cycle} ---")
        activate_kakao()

        for room in rooms:
            try:
                print(f"  [{room}] 대화방 열기...")
                open_kakao_chat(room)
                time.sleep(0.5)

                print(f"  [{room}] 메시지 전송중...")
                send_message(message)
                print(f"  [{room}] 전송 완료!")

                time.sleep(1)
            except Exception as e:
                print(f"  [{room}] 전송 실패: {e}")

        if not repeat:
            print("\n모든 대화방에 메시지를 전송했습니다.")
            break

        cycle += 1
        print(f"\n다음 전송까지 {interval}분 대기중...")
        time.sleep(interval * 60)


def main():
    print("카카오톡 자동 메시지 발송기 v1.0")
    print(f"운영체제: {platform.system()} {platform.release()}")
    print(f"Python: {sys.version}")

    if not IS_MAC and not IS_WIN:
        print("지원하지 않는 운영체제입니다. Windows 또는 macOS만 지원합니다.")
        sys.exit(1)

    config = load_config()

    print("\n메뉴:")
    print("1. 자동 전송 시작")
    print("2. 설정 확인")
    print("3. 테스트 전송 (첫 번째 대화방에 1회)")
    print("4. 종료")

    choice = input("\n선택: ").strip()

    if choice == "1":
        try:
            run_automation(config)
        except KeyboardInterrupt:
            print("\n\n사용자에 의해 중단되었습니다.")
    elif choice == "2":
        print(json.dumps(config, ensure_ascii=False, indent=2))
    elif choice == "3":
        activate_kakao()
        open_kakao_chat(config["rooms"][0])
        send_message(config["message"])
        print("테스트 전송 완료!")
    elif choice == "4":
        print("종료합니다.")
    else:
        print("잘못된 선택입니다.")


if __name__ == "__main__":
    main()
