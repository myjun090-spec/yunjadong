#!/usr/bin/env python3
"""
네이버 블로그 서로이웃 자동 추가
- 키워드로 블로그 검색 후 자동 서이추 신청
- 자동 공감/댓글 기능
- Windows/Mac 모두 지원

사용법:
  1. pip install -r requirements.txt
  2. config.json에 네이버 계정 정보 설정
  3. python neighbor_auto.py
"""

import sys
import os
import json
import time
import platform
import random
from pathlib import Path
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
except ImportError:
    os.system(f"{sys.executable} -m pip install selenium webdriver-manager")
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
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
LOG_FILE = Path(__file__).parent / "neighbor_log.json"

DEFAULT_CONFIG = {
    "naver_id": "",
    "naver_pw": "",
    "search_keywords": ["맛집", "인테리어", "여행"],
    "max_requests_per_day": 50,
    "request_interval_seconds": 30,
    "auto_like": True,
    "auto_comment": True,
    "comment_templates": [
        "좋은 글 잘 보고 있습니다! 서이추 신청드려요 :)",
        "블로그 내용이 정말 유익하네요. 이웃 추가 부탁드립니다!",
        "소통하면서 이웃하고 싶어요~ 서이추 신청합니다!"
    ],
    "min_subscriber_count": 100,
    "recent_post_days": 30
}


def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    save_config(DEFAULT_CONFIG)
    print(f"설정 파일 생성됨: {CONFIG_FILE}")
    return DEFAULT_CONFIG


def save_config(config):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def get_driver():
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


def naver_login(driver, naver_id: str, naver_pw: str):
    """네이버 로그인"""
    driver.get("https://nid.naver.com/nidlogin.login")
    time.sleep(2)

    driver.execute_script(f"document.getElementById('id').value = '{naver_id}'")
    driver.execute_script(f"document.getElementById('pw').value = '{naver_pw}'")
    time.sleep(0.5)

    login_btn = driver.find_element(By.ID, "log.login")
    login_btn.click()
    time.sleep(3)

    print("  로그인 시도 완료.")
    print("  캡차가 나타나면 수동으로 처리해주세요.")
    input("  로그인 완료 후 Enter를 눌러주세요...")


def search_blogs(driver, keyword: str) -> list:
    """키워드로 블로그를 검색합니다."""
    driver.get(f"https://search.naver.com/search.naver?where=blog&query={keyword}")
    time.sleep(2)

    blog_links = []
    try:
        results = driver.find_elements(By.CSS_SELECTOR, ".api_txt_lines.total_tit")
        for result in results[:20]:
            href = result.get_attribute("href")
            if href and "blog.naver.com" in href:
                blog_links.append(href)
    except Exception as e:
        print(f"  검색 실패: {e}")

    return blog_links


def send_neighbor_request(driver, blog_url: str, config: dict) -> dict:
    """서로이웃 신청을 보냅니다."""
    result = {
        "blog_url": blog_url,
        "status": "pending",
        "timestamp": datetime.now().isoformat()
    }

    try:
        driver.get(blog_url)
        time.sleep(2)

        # 공감 누르기
        if config["auto_like"]:
            try:
                like_btn = driver.find_element(By.CSS_SELECTOR, ".u_likeit_list_btn")
                like_btn.click()
                time.sleep(0.5)
                result["liked"] = True
            except Exception:
                result["liked"] = False

        # 댓글 작성
        if config["auto_comment"]:
            try:
                comment = random.choice(config["comment_templates"])
                comment_area = driver.find_element(By.CSS_SELECTOR, ".u_cbox_inbox")
                comment_area.click()
                time.sleep(0.5)
                comment_area.send_keys(comment)
                time.sleep(0.3)

                submit_btn = driver.find_element(By.CSS_SELECTOR, ".u_cbox_btn_upload")
                submit_btn.click()
                time.sleep(1)
                result["commented"] = True
                result["comment"] = comment
            except Exception:
                result["commented"] = False

        # 서이추 신청
        try:
            # 블로그 프로필에서 이웃추가 버튼 찾기
            neighbor_btn = driver.find_element(By.CSS_SELECTOR, ".buddy_btn")
            neighbor_btn.click()
            time.sleep(1)

            # 서로이웃 선택
            mutual_opt = driver.find_element(By.CSS_SELECTOR, "input[value='MUTUAL']")
            mutual_opt.click()
            time.sleep(0.5)

            # 확인 버튼
            confirm_btn = driver.find_element(By.CSS_SELECTOR, ".btn_ok")
            confirm_btn.click()
            time.sleep(1)

            result["status"] = "sent"
            print(f"    서이추 신청 완료!")
        except Exception as e:
            result["status"] = "failed"
            result["error"] = str(e)

    except Exception as e:
        result["status"] = "failed"
        result["error"] = str(e)

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
    print("네이버 블로그 서로이웃 자동 추가 v1.0")
    print(f"운영체제: {platform.system()} {platform.release()}")

    config = load_config()

    if not config["naver_id"]:
        print("\nconfig.json에 네이버 계정 정보를 입력해주세요.")
        return

    print("\n메뉴:")
    print("1. 서이추 자동 신청 시작")
    print("2. 키워드별 블로그 검색만")
    print("3. 설정 확인")
    print("4. 종료")

    choice = input("\n선택: ").strip()

    if choice == "1":
        driver = get_driver()
        results = []
        try:
            naver_login(driver, config["naver_id"], config["naver_pw"])
            daily_count = 0

            for keyword in config["search_keywords"]:
                if daily_count >= config["max_requests_per_day"]:
                    print(f"\n하루 최대 신청 수({config['max_requests_per_day']})에 도달")
                    break

                print(f"\n[{keyword}] 블로그 검색중...")
                blogs = search_blogs(driver, keyword)
                print(f"  {len(blogs)}개 블로그 발견")

                for i, blog_url in enumerate(blogs):
                    if daily_count >= config["max_requests_per_day"]:
                        break

                    print(f"\n  [{i+1}/{len(blogs)}] {blog_url}")
                    result = send_neighbor_request(driver, blog_url, config)
                    results.append(result)
                    daily_count += 1

                    interval = config["request_interval_seconds"]
                    jitter = random.randint(-5, 5)
                    wait = max(10, interval + jitter)
                    print(f"    {wait}초 대기...")
                    time.sleep(wait)

            save_log(results)
            sent = sum(1 for r in results if r["status"] == "sent")
            print(f"\n완료! 신청: {sent}/{len(results)}건")

        except KeyboardInterrupt:
            print("\n중단되었습니다.")
            save_log(results)
        finally:
            driver.quit()

    elif choice == "2":
        driver = get_driver()
        try:
            for keyword in config["search_keywords"]:
                print(f"\n[{keyword}] 검색중...")
                blogs = search_blogs(driver, keyword)
                for b in blogs:
                    print(f"  - {b}")
        finally:
            driver.quit()

    elif choice == "3":
        print(json.dumps(config, ensure_ascii=False, indent=2))

    else:
        print("종료합니다.")


if __name__ == "__main__":
    main()
