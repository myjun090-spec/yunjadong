#!/usr/bin/env python3
"""
네이버 블로그 자동 글쓰기 프로그램
- ChatGPT/Claude API를 활용한 AI 글 생성
- Selenium으로 네이버 블로그에 자동 포스팅
- Windows/Mac 모두 지원

사용법:
  1. pip install -r requirements.txt
  2. config.json에 네이버 계정 정보와 API 키 설정
  3. python blog_auto.py
"""

import sys
import time
import json
import os
import platform
import re
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
    print("필요한 패키지를 설치합니다...")
    os.system(f"{sys.executable} -m pip install selenium webdriver-manager requests")
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

try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests")
    import requests

CONFIG_FILE = Path(__file__).parent / "config.json"
LOG_FILE = Path(__file__).parent / "post_log.json"

DEFAULT_CONFIG = {
    "naver_id": "",
    "naver_pw": "",
    "openai_api_key": "",
    "keywords": ["인테리어 트렌드", "건강한 아침식사", "재택근무 팁"],
    "min_length": 1500,
    "max_length": 3000,
    "auto_post": False,
    "include_images": True,
    "post_interval_minutes": 60,
    "max_posts_per_day": 5
}

IS_MAC = platform.system() == "Darwin"


def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    save_config(DEFAULT_CONFIG)
    print(f"설정 파일이 생성되었습니다: {CONFIG_FILE}")
    print("config.json에 네이버 계정 정보와 OpenAI API 키를 입력해주세요.")
    return DEFAULT_CONFIG


def save_config(config):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def generate_blog_post(keyword: str, api_key: str, min_len: int, max_len: int) -> dict:
    """OpenAI API를 사용하여 블로그 글을 생성합니다."""
    if not api_key:
        print("  OpenAI API 키가 설정되지 않았습니다. 샘플 글을 생성합니다.")
        return {
            "title": f"{keyword} - 완벽 가이드 {datetime.now().strftime('%Y')}",
            "content": f"""
{keyword}에 대해 알아보겠습니다.

## {keyword}란?

{keyword}는 많은 사람들이 관심을 가지고 있는 주제입니다.
이 글에서는 {keyword}에 대한 핵심 정보를 정리해보겠습니다.

## 주요 포인트

1. 첫 번째 포인트: {keyword}의 기본 개념
2. 두 번째 포인트: {keyword}의 실전 활용법
3. 세 번째 포인트: {keyword} 관련 최신 트렌드

## 마무리

{keyword}에 대해 알아보았습니다.
더 궁금한 점이 있다면 댓글로 남겨주세요!

#{'#'.join(keyword.split())} #정보 #가이드
""",
            "tags": keyword.split() + ["정보", "가이드"]
        }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    prompt = f"""다음 키워드로 네이버 블로그 글을 작성해주세요.
키워드: {keyword}

요구사항:
- 제목은 SEO에 최적화
- 본문은 {min_len}~{max_len}자
- 소제목(##)을 활용한 구조화
- 해시태그 5개 포함
- 자연스럽고 친근한 톤

JSON 형식으로 응답:
{{"title": "제목", "content": "본문", "tags": ["태그1", "태그2"]}}
"""

    try:
        resp = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            },
            timeout=60
        )
        result = resp.json()
        content = result["choices"][0]["message"]["content"]
        # JSON 파싱 시도
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        return {"title": f"{keyword} 가이드", "content": content, "tags": keyword.split()}
    except Exception as e:
        print(f"  API 호출 실패: {e}")
        return generate_blog_post(keyword, "", min_len, max_len)


def get_driver():
    """크롬 웹드라이버를 생성합니다."""
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver


def naver_login(driver, naver_id: str, naver_pw: str):
    """네이버에 로그인합니다."""
    driver.get("https://nid.naver.com/nidlogin.login")
    time.sleep(2)

    # JavaScript로 입력 (보안 키패드 우회)
    driver.execute_script(
        f"document.getElementById('id').value = '{naver_id}'"
    )
    driver.execute_script(
        f"document.getElementById('pw').value = '{naver_pw}'"
    )
    time.sleep(0.5)

    # 로그인 버튼 클릭
    login_btn = driver.find_element(By.ID, "log.login")
    login_btn.click()
    time.sleep(3)

    print("  로그인 시도 완료. 캡차가 나타나면 수동으로 처리해주세요.")
    input("  로그인 완료 후 Enter를 눌러주세요...")


def post_to_blog(driver, title: str, content: str, tags: list):
    """네이버 블로그에 글을 포스팅합니다."""
    driver.get("https://blog.naver.com/PostWriteForm.naver")
    time.sleep(3)

    # 에디터 iframe으로 전환
    try:
        driver.switch_to.frame("mainFrame")
        time.sleep(1)

        # 제목 입력
        title_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".se-title-input"))
        )
        title_input.click()
        title_input.send_keys(title)
        time.sleep(0.5)

        # 본문 입력
        body = driver.find_element(By.CSS_SELECTOR, ".se-component-content")
        body.click()
        body.send_keys(content)
        time.sleep(0.5)

        # 태그 입력
        try:
            tag_area = driver.find_element(By.CSS_SELECTOR, ".tag__input")
            for tag in tags[:10]:
                tag_area.send_keys(tag)
                tag_area.send_keys(Keys.ENTER)
                time.sleep(0.2)
        except Exception:
            pass

        print(f"  글 작성 완료: {title}")
        driver.switch_to.default_content()
        return True

    except Exception as e:
        print(f"  포스팅 실패: {e}")
        driver.switch_to.default_content()
        return False


def save_log(post_data: dict):
    """포스팅 로그를 저장합니다."""
    logs = []
    if LOG_FILE.exists():
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
    logs.append({**post_data, "timestamp": datetime.now().isoformat()})
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(logs, f, ensure_ascii=False, indent=2)


def main():
    print("네이버 블로그 자동 글쓰기 v1.0")
    print(f"운영체제: {platform.system()} {platform.release()}")
    print(f"Python: {sys.version}")

    config = load_config()

    if not config["naver_id"]:
        print("\nconfig.json에 네이버 계정 정보를 입력해주세요.")
        return

    print("\n메뉴:")
    print("1. AI 글 생성만 (포스팅X)")
    print("2. AI 글 생성 + 자동 포스팅")
    print("3. 자동 모드 (주기적 포스팅)")
    print("4. 종료")

    choice = input("\n선택: ").strip()

    if choice == "1":
        for keyword in config["keywords"]:
            print(f"\n[{keyword}] 글 생성중...")
            post = generate_blog_post(
                keyword, config["openai_api_key"],
                config["min_length"], config["max_length"]
            )
            print(f"  제목: {post['title']}")
            print(f"  길이: {len(post['content'])}자")
            save_log({"keyword": keyword, **post, "status": "generated"})
        print("\n생성 완료! post_log.json에서 확인하세요.")

    elif choice == "2":
        driver = get_driver()
        try:
            print("\n네이버 로그인...")
            naver_login(driver, config["naver_id"], config["naver_pw"])

            for keyword in config["keywords"]:
                print(f"\n[{keyword}] 글 생성중...")
                post = generate_blog_post(
                    keyword, config["openai_api_key"],
                    config["min_length"], config["max_length"]
                )
                print(f"  제목: {post['title']}")

                print(f"  포스팅중...")
                success = post_to_blog(driver, post["title"], post["content"], post.get("tags", []))
                save_log({"keyword": keyword, **post, "status": "posted" if success else "failed"})
        finally:
            driver.quit()

    elif choice == "3":
        print("자동 모드를 시작합니다.")
        driver = get_driver()
        try:
            naver_login(driver, config["naver_id"], config["naver_pw"])
            day_count = 0
            for keyword in config["keywords"]:
                if day_count >= config["max_posts_per_day"]:
                    print("하루 최대 포스팅 수에 도달했습니다.")
                    break

                print(f"\n[{keyword}] 처리중...")
                post = generate_blog_post(
                    keyword, config["openai_api_key"],
                    config["min_length"], config["max_length"]
                )
                post_to_blog(driver, post["title"], post["content"], post.get("tags", []))
                save_log({"keyword": keyword, **post, "status": "posted"})
                day_count += 1

                if day_count < len(config["keywords"]):
                    wait = config["post_interval_minutes"]
                    print(f"  {wait}분 대기중...")
                    time.sleep(wait * 60)
        except KeyboardInterrupt:
            print("\n사용자에 의해 중단되었습니다.")
        finally:
            driver.quit()

    else:
        print("종료합니다.")


if __name__ == "__main__":
    main()
