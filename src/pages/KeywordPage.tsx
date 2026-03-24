import { useState } from 'react';
import { Search, TrendingUp, BarChart3, Star, Download, Play, Pause, ArrowUp, ArrowDown, Minus, Sparkles, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DownloadButton from '@/components/DownloadButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Keyword {
  id: number;
  keyword: string;
  monthlySearch: number;
  blogPostCount: number;
  competition: 'low' | 'medium' | 'high';
  ratio: number;
  trend: 'up' | 'down' | 'stable';
  isGolden: boolean;
  category: string;
}

const keywords: Keyword[] = [
  { id: 1, keyword: '간헐적 단식 효과', monthlySearch: 12400, blogPostCount: 890, competition: 'low', ratio: 13.9, trend: 'up', isGolden: true, category: '건강' },
  { id: 2, keyword: '홈카페 인테리어', monthlySearch: 8900, blogPostCount: 720, competition: 'low', ratio: 12.4, trend: 'up', isGolden: true, category: '인테리어' },
  { id: 3, keyword: '전세사기 예방법', monthlySearch: 15600, blogPostCount: 1340, competition: 'medium', ratio: 11.6, trend: 'up', isGolden: true, category: '부동산' },
  { id: 4, keyword: '주식 배당금 세금', monthlySearch: 7800, blogPostCount: 680, competition: 'low', ratio: 11.5, trend: 'stable', isGolden: true, category: '재테크' },
  { id: 5, keyword: '애플워치 기능', monthlySearch: 23000, blogPostCount: 2100, competition: 'medium', ratio: 11.0, trend: 'up', isGolden: true, category: 'IT' },
  { id: 6, keyword: '다이어트 식단 추천', monthlySearch: 45000, blogPostCount: 18000, competition: 'high', ratio: 2.5, trend: 'stable', isGolden: false, category: '건강' },
  { id: 7, keyword: '서울 맛집', monthlySearch: 120000, blogPostCount: 95000, competition: 'high', ratio: 1.3, trend: 'stable', isGolden: false, category: '맛집' },
  { id: 8, keyword: '에어프라이어 레시피', monthlySearch: 33000, blogPostCount: 4200, competition: 'medium', ratio: 7.9, trend: 'down', isGolden: false, category: '요리' },
  { id: 9, keyword: '전기차 보조금 2024', monthlySearch: 18500, blogPostCount: 1200, competition: 'low', ratio: 15.4, trend: 'up', isGolden: true, category: '자동차' },
  { id: 10, keyword: '노션 사용법', monthlySearch: 9200, blogPostCount: 850, competition: 'low', ratio: 10.8, trend: 'stable', isGolden: true, category: 'IT' },
  { id: 11, keyword: '퇴직금 계산', monthlySearch: 28000, blogPostCount: 2500, competition: 'medium', ratio: 11.2, trend: 'up', isGolden: true, category: '재테크' },
  { id: 12, keyword: '제주도 여행 코스', monthlySearch: 67000, blogPostCount: 45000, competition: 'high', ratio: 1.5, trend: 'down', isGolden: false, category: '여행' },
  { id: 13, keyword: '코딩 독학 방법', monthlySearch: 11200, blogPostCount: 980, competition: 'low', ratio: 11.4, trend: 'up', isGolden: true, category: 'IT' },
  { id: 14, keyword: '갤럭시 S24 후기', monthlySearch: 34000, blogPostCount: 3800, competition: 'medium', ratio: 8.9, trend: 'up', isGolden: false, category: 'IT' },
  { id: 15, keyword: '원룸 인테리어 꿀팁', monthlySearch: 6500, blogPostCount: 420, competition: 'low', ratio: 15.5, trend: 'up', isGolden: true, category: '인테리어' },
];

const KeywordPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showGoldenOnly, setShowGoldenOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isRunning, setIsRunning] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const filtered = keywords.filter(k => {
    const matchSearch = k.keyword.includes(searchTerm);
    const matchGolden = !showGoldenOnly || k.isGolden;
    const matchCategory = categoryFilter === 'all' || k.category === categoryFilter;
    return matchSearch && matchGolden && matchCategory;
  });

  const goldenCount = keywords.filter(k => k.isGolden).length;
  const avgRatio = Math.round(keywords.reduce((sum, k) => sum + k.ratio, 0) / keywords.length * 10) / 10;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-3 h-3 text-emerald-500" />;
      case 'down': return <ArrowDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getCompBadge = (comp: string) => {
    switch (comp) {
      case 'low': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">낮음</Badge>;
      case 'medium': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">보통</Badge>;
      case 'high': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">높음</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">황금 키워드 자동화</h1>
          <p className="text-muted-foreground text-sm">검색량 대비 경쟁이 낮은 황금 키워드를 자동으로 발굴합니다</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="황금 키워드 자동 발굴"
            description="네이버 검색량 API로 검색량 대비 경쟁이 낮은 황금 키워드를 자동 발견합니다."
            folder="keyword"
            files={[
              { name: "keyword_auto.py", path: "/downloads/keyword/keyword_auto.py" },
              { name: "requirements.txt", path: "/downloads/keyword/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/keyword/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/keyword/run.bat" },
            ]}
            requirements={["Python 3.8+", "네이버 검색 API 키 (선택)"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 중지</> : <><Play className="w-4 h-4 mr-2" /> 자동 분석 시작</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Search className="w-4 h-4" /> 분석 키워드</div>
          <div className="text-2xl font-bold">{keywords.length}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-amber-500 mb-1"><Star className="w-4 h-4" /> 황금 키워드</div>
          <div className="text-2xl font-bold text-amber-500">{goldenCount}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><BarChart3 className="w-4 h-4" /> 평균 비율</div>
          <div className="text-2xl font-bold">{avgRatio}</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp className="w-4 h-4" /> 상승 키워드</div>
          <div className="text-2xl font-bold text-emerald-500">{keywords.filter(k => k.trend === 'up').length}개</div>
        </div>
      </div>

      {isRunning && (
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span className="font-medium">키워드 분석 중...</span>
          </div>
          <Progress value={62} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">네이버 검색량 API 호출 중... (93/150 키워드)</p>
        </div>
      )}

      <Tabs defaultValue="keywords">
        <TabsList>
          <TabsTrigger value="keywords">키워드 목록</TabsTrigger>
          <TabsTrigger value="search">키워드 검색</TabsTrigger>
          <TabsTrigger value="settings">분석 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="키워드 검색..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="건강">건강</SelectItem>
                <SelectItem value="인테리어">인테리어</SelectItem>
                <SelectItem value="부동산">부동산</SelectItem>
                <SelectItem value="재테크">재테크</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="요리">요리</SelectItem>
                <SelectItem value="여행">여행</SelectItem>
                <SelectItem value="자동차">자동차</SelectItem>
                <SelectItem value="맛집">맛집</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={showGoldenOnly} onCheckedChange={setShowGoldenOnly} />
              <Label className="whitespace-nowrap">황금 키워드만</Label>
            </div>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> 엑셀 내보내기</Button>
          </div>

          <div className="apple-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>키워드</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>월간 검색량</TableHead>
                  <TableHead>블로그 글 수</TableHead>
                  <TableHead>비율</TableHead>
                  <TableHead>경쟁도</TableHead>
                  <TableHead>추세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(kw => (
                  <TableRow key={kw.id} className={kw.isGolden ? 'bg-amber-500/5' : ''}>
                    <TableCell>
                      {kw.isGolden && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </TableCell>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell><Badge variant="outline">{kw.category}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-muted-foreground" />
                        {kw.monthlySearch.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{kw.blogPostCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${kw.ratio >= 10 ? 'text-amber-500' : kw.ratio >= 5 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                        {kw.ratio}
                      </span>
                    </TableCell>
                    <TableCell>{getCompBadge(kw.competition)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(kw.trend)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="apple-card p-4">
            <p className="text-xs text-muted-foreground">
              <Star className="w-3 h-3 inline text-amber-500 fill-amber-500 mr-1" />
              <strong>황금 키워드 기준:</strong> 월간 검색량 / 블로그 글 수 비율이 10 이상이고, 경쟁도가 낮거나 보통인 키워드
            </p>
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Target className="w-5 h-5" /> 키워드 분석 요청</h3>
            <div>
              <Label>분석할 키워드 (쉼표로 구분)</Label>
              <Input placeholder="키워드1, 키워드2, 키워드3..." value={newKeyword} onChange={e => setNewKeyword(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">입력한 키워드의 검색량과 경쟁도를 분석합니다</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>연관 키워드 확장</Label>
                <Select defaultValue="yes">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">연관 키워드 포함</SelectItem>
                    <SelectItem value="no">입력 키워드만</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>분석 기간</Label>
                <Select defaultValue="1m">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1w">최근 1주</SelectItem>
                    <SelectItem value="1m">최근 1개월</SelectItem>
                    <SelectItem value="3m">최근 3개월</SelectItem>
                    <SelectItem value="6m">최근 6개월</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button disabled={!newKeyword}><Search className="w-4 h-4 mr-2" /> 키워드 분석</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="apple-card p-6 space-y-6">
            <h3 className="font-semibold">분석 설정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>황금 키워드 비율 기준</Label>
                <Input type="number" defaultValue={10} />
                <p className="text-xs text-muted-foreground mt-1">검색량/글수 비율이 이 값 이상이면 황금 키워드</p>
              </div>
              <div>
                <Label>최소 월간 검색량</Label>
                <Input type="number" defaultValue={1000} />
              </div>
              <div>
                <Label>자동 분석 주기</Label>
                <Select defaultValue="daily">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">매시간</SelectItem>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">매주</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>데이터 소스</Label>
                <Select defaultValue="naver">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="naver">네이버 검색량 API</SelectItem>
                    <SelectItem value="google">구글 트렌드</SelectItem>
                    <SelectItem value="both">네이버 + 구글</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>새 황금 키워드 발견 시 알림</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>자동 블로그 글 생성 연동</Label>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordPage;
