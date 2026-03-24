#!/usr/bin/env python3
"""
카카오톡 자동 메시지 발송기 - GUI 버전
더블클릭으로 실행 가능한 데스크톱 앱
"""

import sys
import os
import json
import time
import platform
import threading
from pathlib import Path

# tkinter import
try:
    import tkinter as tk
    from tkinter import ttk, messagebox, scrolledtext
except ImportError:
    print("tkinter를 사용할 수 없습니다.")
    sys.exit(1)

try:
    import pyautogui
    import pyperclip
except ImportError:
    os.system(f"{sys.executable} -m pip install pyautogui pyperclip Pillow")
    import pyautogui
    import pyperclip

IS_MAC = platform.system() == "Darwin"
IS_WIN = platform.system() == "Windows"
CONFIG_FILE = Path(__file__).parent / "kakao_config.json"


class KakaoAutoApp:
    def __init__(self, root):
        self.root = root
        self.root.title("카카오톡 자동 발송기 v1.0")
        self.root.geometry("600x700")
        self.root.resizable(True, True)
        self.is_running = False
        self.thread = None

        self.config = self.load_config()
        self.build_ui()

    def load_config(self):
        if CONFIG_FILE.exists():
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "rooms": [],
            "message": "",
            "interval_minutes": 5,
            "repeat": True
        }

    def save_config(self):
        rooms = self.rooms_text.get("1.0", tk.END).strip().split("\n")
        self.config = {
            "rooms": [r.strip() for r in rooms if r.strip()],
            "message": self.msg_text.get("1.0", tk.END).strip(),
            "interval_minutes": int(self.interval_var.get()),
            "repeat": self.repeat_var.get()
        }
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(self.config, f, ensure_ascii=False, indent=2)

    def build_ui(self):
        style = ttk.Style()
        style.configure("Title.TLabel", font=("Arial", 14, "bold"))
        style.configure("Start.TButton", font=("Arial", 11, "bold"))

        main = ttk.Frame(self.root, padding=15)
        main.pack(fill=tk.BOTH, expand=True)

        # Title
        ttk.Label(main, text="카카오톡 자동 메시지 발송기", style="Title.TLabel").pack(pady=(0, 10))
        ttk.Label(main, text=f"운영체제: {platform.system()} | Python {sys.version.split()[0]}").pack()

        ttk.Separator(main, orient="horizontal").pack(fill=tk.X, pady=10)

        # 대화방 목록
        ttk.Label(main, text="대화방 목록 (한 줄에 하나씩)", font=("Arial", 10, "bold")).pack(anchor=tk.W)
        self.rooms_text = scrolledtext.ScrolledText(main, height=5, font=("Arial", 10))
        self.rooms_text.pack(fill=tk.X, pady=(2, 8))
        self.rooms_text.insert(tk.END, "\n".join(self.config.get("rooms", [])))

        # 메시지 내용
        ttk.Label(main, text="보낼 메시지", font=("Arial", 10, "bold")).pack(anchor=tk.W)
        self.msg_text = scrolledtext.ScrolledText(main, height=6, font=("Arial", 10))
        self.msg_text.pack(fill=tk.X, pady=(2, 8))
        self.msg_text.insert(tk.END, self.config.get("message", ""))

        # 설정
        settings_frame = ttk.Frame(main)
        settings_frame.pack(fill=tk.X, pady=5)

        ttk.Label(settings_frame, text="전송 간격 (분):").pack(side=tk.LEFT)
        self.interval_var = tk.StringVar(value=str(self.config.get("interval_minutes", 5)))
        ttk.Spinbox(settings_frame, from_=1, to=1440, textvariable=self.interval_var, width=8).pack(side=tk.LEFT, padx=5)

        self.repeat_var = tk.BooleanVar(value=self.config.get("repeat", True))
        ttk.Checkbutton(settings_frame, text="반복 전송", variable=self.repeat_var).pack(side=tk.LEFT, padx=15)

        ttk.Separator(main, orient="horizontal").pack(fill=tk.X, pady=10)

        # 버튼
        btn_frame = ttk.Frame(main)
        btn_frame.pack(fill=tk.X, pady=5)

        self.start_btn = ttk.Button(btn_frame, text="전송 시작", command=self.toggle_run, style="Start.TButton")
        self.start_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))

        ttk.Button(btn_frame, text="테스트 (1회)", command=self.test_send).pack(side=tk.LEFT, padx=(0, 5))
        ttk.Button(btn_frame, text="설정 저장", command=self.save_config).pack(side=tk.LEFT)

        # 로그
        ttk.Label(main, text="실행 로그", font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=(10, 2))
        self.log_text = scrolledtext.ScrolledText(main, height=10, font=("Consolas", 9), state=tk.DISABLED)
        self.log_text.pack(fill=tk.BOTH, expand=True)

        # 상태바
        self.status_var = tk.StringVar(value="대기중")
        ttk.Label(main, textvariable=self.status_var, foreground="gray").pack(anchor=tk.W, pady=(5, 0))

    def log(self, msg):
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.configure(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"[{timestamp}] {msg}\n")
        self.log_text.see(tk.END)
        self.log_text.configure(state=tk.DISABLED)

    def activate_kakao(self):
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

    def open_chat(self, room_name):
        pyautogui.hotkey("command" if IS_MAC else "ctrl", "f")
        time.sleep(0.5)
        pyautogui.hotkey("command" if IS_MAC else "ctrl", "a")
        time.sleep(0.1)
        pyperclip.copy(room_name)
        pyautogui.hotkey("command" if IS_MAC else "ctrl", "v")
        time.sleep(1)
        pyautogui.press("enter")
        time.sleep(0.5)

    def send_message(self, message):
        pyperclip.copy(message)
        pyautogui.hotkey("command" if IS_MAC else "ctrl", "v")
        time.sleep(0.3)
        pyautogui.press("enter")
        time.sleep(0.3)

    def run_automation(self):
        self.save_config()
        rooms = self.config["rooms"]
        message = self.config["message"]
        interval = self.config["interval_minutes"]

        if not rooms or not message:
            self.log("대화방과 메시지를 입력해주세요.")
            self.is_running = False
            self.start_btn.configure(text="전송 시작")
            return

        cycle = 1
        while self.is_running:
            self.log(f"--- 전송 사이클 #{cycle} ---")
            self.status_var.set(f"전송중... (사이클 #{cycle})")
            self.activate_kakao()

            for room in rooms:
                if not self.is_running:
                    break
                try:
                    self.log(f"  [{room}] 대화방 열기...")
                    self.open_chat(room)
                    self.log(f"  [{room}] 메시지 전송...")
                    self.send_message(message)
                    self.log(f"  [{room}] 전송 완료!")
                    time.sleep(1)
                except Exception as e:
                    self.log(f"  [{room}] 실패: {e}")

            if not self.config["repeat"]:
                break

            cycle += 1
            self.status_var.set(f"대기중... (다음 전송까지 {interval}분)")
            for _ in range(interval * 60):
                if not self.is_running:
                    break
                time.sleep(1)

        self.is_running = False
        self.start_btn.configure(text="전송 시작")
        self.status_var.set("중지됨")
        self.log("자동 전송이 중지되었습니다.")

    def toggle_run(self):
        if self.is_running:
            self.is_running = False
            self.start_btn.configure(text="전송 시작")
        else:
            self.is_running = True
            self.start_btn.configure(text="전송 중지")
            self.thread = threading.Thread(target=self.run_automation, daemon=True)
            self.thread.start()

    def test_send(self):
        self.save_config()
        if not self.config["rooms"] or not self.config["message"]:
            messagebox.showwarning("경고", "대화방과 메시지를 입력해주세요.")
            return
        self.log("테스트 전송 시작...")
        self.activate_kakao()
        self.open_chat(self.config["rooms"][0])
        self.send_message(self.config["message"])
        self.log("테스트 전송 완료!")


def main():
    root = tk.Tk()
    app = KakaoAutoApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
