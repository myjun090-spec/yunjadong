#!/usr/bin/env python3
"""
부동산 매물 수집 자동화
- 네이버 부동산에서 매물 정보를 자동 수집
- 엑셀로 내보내기
- Windows/Mac 모두 지원

사용법:
  1. pip install -r requirements.txt
  2. python realestate_auto.py
"""

import sys
import os
import json
import time
import platform
import csv
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    os.system(f"{sys.executable} -m pip install requests")
    import requests

try:
    import openpyxl
except ImportError:
    os.system(f"{sys.executable} -m pip install openpyxl")
    import openpyxl

CONFIG_FILE = Path(__file__).parent / "config.json"
OUTPUT_DIR = Path(__file__).parent / "output"

DEFAULT_CONFIG = {
    "regions": [
        {"name": "강남구", "code": "1168000000"},
        {"name": "서초구", "code": "1165000000"},
        {"name": "송파구", "code": "1171000000"}
    ],
    "deal_types": ["매매", "전세", "월세"],
    "property_types": ["아파트", "오피스텔"],
    "price_min": 0,
    "price_max": 0,
    "crawl_interval_minutes": 30
}

# 네이버 부동산 API (비공식)
NAVER_LAND_API = "https://m.land.naver.com/cluster/ajax/articleList"
NAVER_LAND_COMPLEX = "https://m.land.naver.com/cluster/ajax/complexList"


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


def fetch_properties(region_code: str, deal_type: str = "A1") -> list:
    """네이버 부동산에서 매물 목록을 가져옵니다."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Referer": "https://m.land.naver.com/"
    }

    # 거래 유형 매핑
    trade_map = {"매매": "A1", "전세": "B1", "월세": "B2"}
    trade_code = trade_map.get(deal_type, "A1")

    params = {
        "rletTpCd": "APT",  # 아파트
        "tradTpCd": trade_code,
        "z": "13",
        "cortarNo": region_code,
        "page": 1,
        "articleState": ""
    }

    try:
        resp = requests.get(NAVER_LAND_API, params=params, headers=headers, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("body", [])
        else:
            print(f"  API 응답 오류: {resp.status_code}")
            return []
    except Exception as e:
        print(f"  요청 실패: {e}")
        return []


def parse_properties(raw_data: list, region_name: str, deal_type: str) -> list:
    """수집된 데이터를 정리합니다."""
    results = []
    for item in raw_data:
        try:
            results.append({
                "지역": region_name,
                "거래유형": deal_type,
                "매물명": item.get("atclNm", ""),
                "면적": item.get("spc1", ""),
                "전용면적": item.get("spc2", ""),
                "층": item.get("flrInfo", ""),
                "가격": item.get("hanPrc", ""),
                "보증금": item.get("rentPrc", ""),
                "방향": item.get("direction", ""),
                "확인일": item.get("atclCfmYmd", ""),
                "매물번호": item.get("atclNo", ""),
                "수집일시": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
        except Exception:
            continue
    return results


def export_to_excel(properties: list, filename: str = None):
    """수집된 데이터를 엑셀로 내보냅니다."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    if not filename:
        filename = f"부동산매물_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"

    filepath = OUTPUT_DIR / filename
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "매물목록"

    # 헤더
    if properties:
        headers = list(properties[0].keys())
        ws.append(headers)

        # 헤더 스타일
        for cell in ws[1]:
            cell.font = openpyxl.styles.Font(bold=True)

        # 데이터
        for prop in properties:
            ws.append([prop.get(h, "") for h in headers])

        # 컬럼 너비 자동 조정
        for col in ws.columns:
            max_length = max(len(str(cell.value or "")) for cell in col)
            ws.column_dimensions[col[0].column_letter].width = min(max_length + 2, 30)

    wb.save(filepath)
    print(f"\n엑셀 파일 저장됨: {filepath}")
    return filepath


def export_to_csv(properties: list, filename: str = None):
    """수집된 데이터를 CSV로 내보냅니다."""
    OUTPUT_DIR.mkdir(exist_ok=True)
    if not filename:
        filename = f"부동산매물_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    filepath = OUTPUT_DIR / filename
    if properties:
        with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=properties[0].keys())
            writer.writeheader()
            writer.writerows(properties)
    print(f"\nCSV 파일 저장됨: {filepath}")
    return filepath


def run_crawl(config: dict) -> list:
    """매물 수집을 실행합니다."""
    all_properties = []

    for region in config["regions"]:
        for deal_type in config["deal_types"]:
            print(f"\n  [{region['name']}] {deal_type} 매물 수집중...")
            raw = fetch_properties(region["code"], deal_type)
            parsed = parse_properties(raw, region["name"], deal_type)
            all_properties.extend(parsed)
            print(f"    {len(parsed)}건 수집됨")
            time.sleep(1)  # API 요청 간격

    return all_properties


def main():
    print("부동산 매물 수집 자동화 v1.0")
    print(f"운영체제: {platform.system()} {platform.release()}")

    config = load_config()

    print("\n메뉴:")
    print("1. 매물 수집 (1회)")
    print("2. 자동 수집 (주기적)")
    print("3. 설정 확인")
    print("4. 종료")

    choice = input("\n선택: ").strip()

    if choice == "1":
        print("\n매물 수집을 시작합니다...")
        properties = run_crawl(config)
        print(f"\n총 {len(properties)}건 수집 완료")

        if properties:
            print("\n내보내기 형식:")
            print("1. Excel (.xlsx)")
            print("2. CSV (.csv)")
            fmt = input("선택: ").strip()
            if fmt == "2":
                export_to_csv(properties)
            else:
                export_to_excel(properties)

    elif choice == "2":
        interval = config["crawl_interval_minutes"]
        print(f"\n자동 수집 모드 ({interval}분 간격)")
        print("중단하려면 Ctrl+C")
        try:
            while True:
                properties = run_crawl(config)
                if properties:
                    export_to_excel(properties)
                print(f"\n다음 수집까지 {interval}분 대기...")
                time.sleep(interval * 60)
        except KeyboardInterrupt:
            print("\n중단되었습니다.")

    elif choice == "3":
        print(json.dumps(config, ensure_ascii=False, indent=2))

    else:
        print("종료합니다.")


if __name__ == "__main__":
    main()
