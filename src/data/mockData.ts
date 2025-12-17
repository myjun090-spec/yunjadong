// Mock data for the Office Automation Dashboard

export const kpiData = {
  mailsSent: 12847,
  upcomingEvents: 23,
  collectedNews: 1892,
  systemStatus: 99.7,
};

export const activityLogs = [
  { id: 1, type: 'mail', message: '뉴스레터 캠페인이 성공적으로 발송되었습니다', time: '2분 전', icon: 'Mail' },
  { id: 2, type: 'event', message: '2024 신년 컨퍼런스 등록자 50명 추가', time: '15분 전', icon: 'Calendar' },
  { id: 3, type: 'crawler', message: '정부24 공고 데이터 수집 완료 (32건)', time: '1시간 전', icon: 'Globe' },
  { id: 4, type: 'alert', message: 'Google Alerts: "AI 기술동향" 키워드 뉴스 12건', time: '2시간 전', icon: 'Bell' },
  { id: 5, type: 'system', message: '시스템 자동 백업 완료', time: '3시간 전', icon: 'Shield' },
  { id: 6, type: 'mail', message: 'SMS 캠페인 "연말행사 안내" 발송 완료', time: '4시간 전', icon: 'MessageSquare' },
  { id: 7, type: 'event', message: '워크샵 참석자 명단 업데이트', time: '5시간 전', icon: 'Users' },
];

export const mailHistory = [
  { id: 1, date: '2024-01-15', title: '2024년 1월 뉴스레터', recipients: 2340, status: 'success' },
  { id: 2, date: '2024-01-14', title: '신년 인사 메일', recipients: 5678, status: 'success' },
  { id: 3, date: '2024-01-13', title: '연말행사 초대장 발송', recipients: 890, status: 'pending' },
  { id: 4, date: '2024-01-12', title: '제품 업데이트 안내', recipients: 3421, status: 'success' },
  { id: 5, date: '2024-01-11', title: '설문조사 참여 요청', recipients: 1200, status: 'failed' },
  { id: 6, date: '2024-01-10', title: '월간 리포트 발송', recipients: 4500, status: 'success' },
  { id: 7, date: '2024-01-09', title: '긴급 공지사항', recipients: 6789, status: 'success' },
  { id: 8, date: '2024-01-08', title: '이벤트 당첨자 안내', recipients: 150, status: 'pending' },
];

export const events = [
  {
    id: 1,
    title: '2024 신년 컨퍼런스',
    date: '2024-02-15',
    location: '코엑스 컨벤션센터',
    registrants: 342,
    capacity: 400,
    attendanceRate: 85,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'AI 기술 워크샵',
    date: '2024-02-20',
    location: '삼성동 SETEC',
    registrants: 156,
    capacity: 200,
    attendanceRate: 92,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    title: '스타트업 네트워킹 데이',
    date: '2024-03-01',
    location: '강남 WeWork',
    registrants: 89,
    capacity: 100,
    attendanceRate: 78,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
  },
  {
    id: 4,
    title: '디지털 마케팅 세미나',
    date: '2024-03-10',
    location: '서울 드래곤시티',
    registrants: 267,
    capacity: 300,
    attendanceRate: 88,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop',
  },
  {
    id: 5,
    title: '클라우드 컴퓨팅 포럼',
    date: '2024-03-25',
    location: '판교 스타트업 캠퍼스',
    registrants: 198,
    capacity: 250,
    attendanceRate: 91,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
  },
  {
    id: 6,
    title: '비즈니스 리더십 워크샵',
    date: '2024-04-05',
    location: '롯데호텔 서울',
    registrants: 120,
    capacity: 150,
    attendanceRate: 95,
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
  },
];

export const newsAlerts = [
  {
    id: 1,
    title: 'AI 기술, 2024년 핵심 트렌드로 부상',
    summary: '인공지능 기술이 산업 전반에 걸쳐 혁신을 주도하며 2024년 기술 트렌드의 중심에 서고 있다. 특히 생성형 AI의 발전이 두드러진다.',
    source: 'TechCrunch',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=180&fit=crop',
    url: '#',
  },
  {
    id: 2,
    title: '클라우드 시장, 연간 25% 성장 전망',
    summary: '글로벌 클라우드 컴퓨팅 시장이 지속적인 성장세를 보이며 2024년에도 25% 이상의 성장이 예상된다.',
    source: 'Forbes',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=180&fit=crop',
    url: '#',
  },
  {
    id: 3,
    title: '사이버 보안 투자, 역대 최고치 경신',
    summary: '기업들의 사이버 보안에 대한 관심이 높아지면서 관련 투자가 역대 최고 수준을 기록했다.',
    source: 'Bloomberg',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=180&fit=crop',
    url: '#',
  },
  {
    id: 4,
    title: '원격 근무, 새로운 업무 표준으로 자리잡다',
    summary: '팬데믹 이후 도입된 원격 근무가 이제는 많은 기업에서 표준 업무 방식으로 자리잡고 있다.',
    source: 'Harvard Business Review',
    date: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=300&h=180&fit=crop',
    url: '#',
  },
  {
    id: 5,
    title: '5G 상용화로 IoT 시장 폭발적 성장',
    summary: '5G 네트워크의 확산으로 사물인터넷(IoT) 시장이 전례 없는 성장세를 보이고 있다.',
    source: 'Reuters',
    date: '2024-01-11',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=180&fit=crop',
    url: '#',
  },
  {
    id: 6,
    title: '그린 테크 스타트업 투자 급증',
    summary: '환경 친화적 기술을 개발하는 그린 테크 스타트업에 대한 투자가 급증하고 있다.',
    source: 'The Economist',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=300&h=180&fit=crop',
    url: '#',
  },
];

export const crawlerData = [
  { id: 1, company: '삼성전자', announcement: '2024년 상반기 공채', deadline: '2024-02-28', status: 'active', source: 'saramin.co.kr' },
  { id: 2, company: 'LG에너지솔루션', announcement: '경력직 수시채용', deadline: '2024-02-15', status: 'active', source: 'jobkorea.co.kr' },
  { id: 3, company: '네이버', announcement: '개발자 채용', deadline: '2024-03-10', status: 'active', source: 'naver.com' },
  { id: 4, company: '카카오', announcement: 'AI 연구원 모집', deadline: '2024-02-20', status: 'active', source: 'kakao.com' },
  { id: 5, company: 'SK하이닉스', announcement: '신입사원 공채', deadline: '2024-01-31', status: 'closed', source: 'skhynix.com' },
  { id: 6, company: '현대자동차', announcement: '전기차 개발인력 채용', deadline: '2024-03-15', status: 'active', source: 'hyundai.com' },
  { id: 7, company: '포스코', announcement: '글로벌 인재 채용', deadline: '2024-02-25', status: 'active', source: 'posco.com' },
  { id: 8, company: '두산에너빌리티', announcement: '에너지 엔지니어 모집', deadline: '2024-03-05', status: 'active', source: 'doosan.com' },
  { id: 9, company: '한화솔루션', announcement: '태양광 사업부 채용', deadline: '2024-02-18', status: 'active', source: 'hanwha.com' },
  { id: 10, company: 'CJ제일제당', announcement: '바이오 연구원', deadline: '2024-01-25', status: 'closed', source: 'cj.net' },
  { id: 11, company: '롯데케미칼', announcement: '화학공정 엔지니어', deadline: '2024-03-20', status: 'active', source: 'lottechem.com' },
  { id: 12, company: 'KT', announcement: 'AI/빅데이터 전문가', deadline: '2024-02-22', status: 'active', source: 'kt.com' },
];

export const targetSites = [
  { id: 1, url: 'https://www.saramin.co.kr', name: '사람인', lastCrawl: '2024-01-15 14:30', status: 'active' },
  { id: 2, url: 'https://www.jobkorea.co.kr', name: '잡코리아', lastCrawl: '2024-01-15 14:25', status: 'active' },
  { id: 3, url: 'https://www.gov.kr', name: '정부24', lastCrawl: '2024-01-15 14:20', status: 'active' },
  { id: 4, url: 'https://www.wanted.co.kr', name: '원티드', lastCrawl: '2024-01-15 14:15', status: 'paused' },
];
