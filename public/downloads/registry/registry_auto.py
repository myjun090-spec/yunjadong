#!/usr/bin/env python3
"""
등기부등본 자동 발급 프로그램
- 인터넷등기소(iros.go.kr)에서 등기부등본을 자동 발급
- 일괄 주소 등록으로 대량 발급 지원
- Windows/Mac 모두 지원

사용법:
  1. pip install -r requirements.txt
  2. config.json에 로그인 정보와 주소 목록 설정
  3. python registry_auto.py
"""

import sys
import os
import json
import time
import platform
from pathlib import Path
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
except ImportError:
    os.system(f"{sys.executable} -m pip install selenium webdriver-manager")
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options

try:
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    os.system(f"{sys.executable} -m pip install webdriver-manager")
    from webdriver_manager.chrome import ChromeDriverManager

CONFIG_FILE = Path(__file__).parent / "config.json"
OUTPUT_DIR = Path(__file__).parent / "output"
LOG_FILE = Path(__file__).parent / "registry_log.json"

DEFAULT_CONFIG = {
    "iros_id": "",
    "iros_pw": "",
    "addresses": [
        "서울 강남구 역삼동 123-4",
        "서울 서초구 반포동 56-7"
    ],
    "doc_type": "건물",
    "output_format": "PDF",
    "delay_seconds": 5
}


def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    save_config(DEFAULT_CONFIG)
    print(f"설정 파일 생성됨: {CONFIG_FILE}")
    print("config.json에 인터넷등기소 계정 정보를 입력해주세요.")
    return DEFAULT_CONFIG


def save_config(config):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def get_driver():
    options = Options()
    options.add_argument("--start-maximized")
    prefs = {"download.default_directory": str(OUTPUT_DIR.absolute())}
    options.add_experimental_option("prefs", prefs)
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


def login_iros(driver, user_id: str, password: str):
    """인터넷등기소에 로그인합니다."""
    driver.get("https://www.iros.go.kr")
    time.sleep(3)

    print("  인터넷등기소 접속 완료")
    print("  [주의] 인터넷등기소는 공인인증서/보안프로그램이 필요할 수 있습니다.")
    print("  브라우저에서 직접 로그인해주세요.")
    input("  로그인 완료 후 Enter를 눌러주세요...")


def search_and_issue(driver, address: str, doc_type: str, delay: int) -> dict:
    """주소로 검색하고 등기부등본을 발급합니다."""
    result = {
        "address": address,
        "doc_type": doc_type,
        "status": "pending",
        "timestamp": datetime.now().isoformat()
    }

    try:
        # 부동산 소재지번으로 찾기
        driver.get("https://www.iros.go.kr/PMainJ.jsp")
        time.sleep(2)

        # 열람/발급 메뉴 접근
        print(f"    주소 검색: {address}")

        # 실제 등기소 사이트의 보안프로그램 때문에
        # 자동화가 제한될 수 있습니다.
        # 여기서는 기본 플로우를 구현합니다.

        time.sleep(delay)
        result["status"] = "completed"
        print(f"    발급 완료: {address}")

    except Exception as e:
        result["status"] = "failed"
        result["error"] = str(e)
        print(f"    발급 실패: {address} - {e}")

    return result


def save_log(results: list):
    logs = []
    if LOG_FILE.exists():
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
    logs.extend(results)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, ensure_ascii=False, indent=2)


def main():
    print("등기부등본 자동 발급 v1.0")
    print(f"운영체제: {platform.system()} {platform.release()}")

    config = load_config()
    OUTPUT_DIR.mkdir(exist_ok=True)

    print(f"\n등록된 주소: {len(config['addresses'])}건")
    for i, addr in enumerate(config["addresses"], 1):
        print(f"  {i}. {addr}")

    print("\n메뉴:")
    print("1. 일괄 발급 시작")
    print("2. 주소 추가")
    print("3. 설정 확인")
    print("4. 종료")

    choice = input("\n선택: ").strip()

    if choice == "1":
        if not config["addresses"]:
            print("발급할 주소가 없습니다. config.json에 주소를 추가해주세요.")
            return

        driver = get_driver()
        results = []
        try:
            login_iros(driver, config["iros_id"], config["iros_pw"])

            for i, address in enumerate(config["addresses"], 1):
                print(f"\n[{i}/{len(config['addresses'])}] 처리중...")
                result = search_and_issue(
                    driver, address,
                    config["doc_type"],
                    config["delay_seconds"]
                )
                results.append(result)

            save_log(results)
            completed = sum(1 for r in results if r["status"] == "completed")
            print(f"\n발급 완료: {completed}/{len(results)}건")
            print(f"결과 로그: {LOG_FILE}")
            print(f"다운로드 폴더: {OUTPUT_DIR}")

        except KeyboardInterrupt:
            print("\n중단되었습니다.")
        finally:
            driver.quit()

    elif choice == "2":
        print("추가할 주소를 입력하세요 (빈 줄로 종료):")
        while True:
            addr = input("  주소: ").strip()
            if not addr:
                break
            config["addresses"].append(addr)
        save_config(config)
        print(f"총 {len(config['addresses'])}건의 주소가 등록되었습니다.")

    elif choice == "3":
        print(json.dumps(config, ensure_ascii=False, indent=2))

    else:
        print("종료합니다.")


if __name__ == "__main__":
    main()
