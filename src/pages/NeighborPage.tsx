import { useState } from 'react';
import { UserPlus, Play, Pause, Search, Users, Heart, MessageCircle, CheckCircle2, Clock, XCircle, TrendingUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import DownloadButton from '@/components/DownloadButton';

interface NeighborRequest {
  id: number;
  blogName: string;
  blogId: string;
  category: string;
  followers: number;
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  sentAt?: string;
  comment?: string;
}

const initialRequests: NeighborRequest[] = [
  { id: 1, blogName: '맛집탐험기', blogId: 'food_explorer', category: '맛집', followers: 3420, status: 'accepted', sentAt: '2024-01-15 09:00', comment: '좋은 글 잘 보고 있습니다! 서이추 신청드려요 😊' },
  { id: 2, blogName: '인테리어하우스', blogId: 'interior_house', category: '인테리어', followers: 8900, status: 'accepted', sentAt: '2024-01-15 09:15', comment: '인테리어 팁 정말 유용해요! 이웃 추가 부탁드립니다.' },
  { id: 3, blogName: '육아일기', blogId: 'baby_diary', category: '육아', followers: 5670, status: 'sent', sentAt: '2024-01-15 10:00', comment: '좋은 정보 감사합니다. 서이추 신청합니다!' },
  { id: 4, blogName: '여행의정석', blogId: 'travel_master', category: '여행', followers: 12300, status: 'sent', sentAt: '2024-01-15 10:30', comment: '여행 사진이 너무 예뻐요! 이웃 해요~' },
  { id: 5, blogName: '주식부자되기', blogId: 'stock_rich', category: '재테크', followers: 15600, status: 'rejected', sentAt: '2024-01-14 14:00' },
  { id: 6, blogName: 'IT개발노트', blogId: 'dev_note', category: 'IT', followers: 7800, status: 'accepted', sentAt: '2024-01-14 15:00', comment: '개발 관련 글 잘 읽고 있어요. 서이추요!' },
  { id: 7, blogName: '운동하는직장인', blogId: 'fit_worker', category: '운동', followers: 4500, status: 'pending' },
  { id: 8, blogName: '카페투어러', blogId: 'cafe_tour', category: '카페', followers: 6700, status: 'pending' },
  { id: 9, blogName: '부동산스터디', blogId: 'realestate_study', category: '부동산', followers: 9200, status: 'accepted', sentAt: '2024-01-13 11:00', comment: '부동산 분석 글 좋아합니다!' },
  { id: 10, blogName: '독서모임', blogId: 'book_club', category: '독서', followers: 3100, status: 'sent', sentAt: '2024-01-15 11:00', comment: '책 리뷰 잘 보고 있어요. 서이추 합니다!' },
];

const NeighborPage = () => {
  const [requests, setRequests] = useState<NeighborRequest[]>(initialRequests);
  const [isRunning, setIsRunning] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [targetCategory, setTargetCategory] = useState('all');
  const [commentTemplates, setCommentTemplates] = useState<string[]>([
    '좋은 글 잘 보고 있습니다! 서이추 신청드려요 😊',
    '블로그 내용이 정말 유익하네요. 이웃 추가 부탁드립니다!',
    '소통하면서 이웃하고 싶어요~ 서이추 신청합니다!',
  ]);

  const accepted = requests.filter(r => r.status === 'accepted').length;
  const sent = requests.filter(r => r.status === 'sent').length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalDecided = accepted + rejectedCount;
  const acceptRate = totalDecided > 0 ? Math.round((accepted / totalDecided) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> 대기중</Badge>;
      case 'sent': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><MessageCircle className="w-3 h-3 mr-1" /> 신청완료</Badge>;
      case 'accepted': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> 수락됨</Badge>;
      case 'rejected': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> 거절됨</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">서로이웃 추가 자동화</h1>
          <p className="text-muted-foreground text-sm">네이버 블로그 서로이웃을 자동으로 신청하고 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="서로이웃 자동 추가"
            description="네이버 블로그에서 키워드 검색 후 자동으로 서이추를 신청합니다."
            folder="neighbor"
            files={[
              { name: "neighbor_auto.py", path: "/downloads/neighbor/neighbor_auto.py" },
              { name: "requirements.txt", path: "/downloads/neighbor/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/neighbor/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/neighbor/run.bat" },
            ]}
            requirements={["Python 3.8+", "Chrome 브라우저", "네이버 계정"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 중지</> : <><Play className="w-4 h-4 mr-2" /> 자동 신청 시작</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-1"><UserPlus className="w-4 h-4" /> 수락됨</div>
          <div className="text-2xl font-bold text-emerald-500">{accepted}명</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-blue-500 mb-1"><MessageCircle className="w-4 h-4" /> 신청완료</div>
          <div className="text-2xl font-bold text-blue-500">{sent}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Clock className="w-4 h-4" /> 대기중</div>
          <div className="text-2xl font-bold">{pending}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp className="w-4 h-4" /> 수락률</div>
          <div className="text-2xl font-bold">{acceptRate}%</div>
        </div>
      </div>

      {isRunning && (
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="font-medium">자동 서이추 진행중...</span>
            <span className="text-sm text-muted-foreground">키워드 '맛집'으로 블로그 검색 후 신청 중</span>
          </div>
          <Progress value={45} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">오늘 신청: 12/50건 (최대 50건/일)</p>
        </div>
      )}

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">서이추 내역</TabsTrigger>
          <TabsTrigger value="search">블로그 검색</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="apple-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{req.blogName}</span>
                      <Badge variant="outline" className="text-xs">{req.category}</Badge>
                      {getStatusBadge(req.status)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{req.blogId} · 구독자 {req.followers.toLocaleString()}명
                      {req.sentAt && ` · 신청: ${req.sentAt}`}
                    </div>
                    {req.comment && <p className="text-xs text-muted-foreground mt-1 italic">"{req.comment}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === 'accepted' && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-semibold">타겟 블로그 검색 설정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>검색 키워드</Label>
                <Input placeholder="맛집, 인테리어, 육아 등" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">이 키워드로 네이버에서 블로그를 검색합니다</p>
              </div>
              <div>
                <Label>카테고리 필터</Label>
                <Select value={targetCategory} onValueChange={setTargetCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="맛집">맛집</SelectItem>
                    <SelectItem value="여행">여행</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="재테크">재테크</SelectItem>
                    <SelectItem value="육아">육아</SelectItem>
                    <SelectItem value="인테리어">인테리어</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>최소 구독자 수</Label>
                <Input type="number" defaultValue={1000} />
              </div>
              <div>
                <Label>최근 포스팅 기준 (일)</Label>
                <Input type="number" defaultValue={30} />
                <p className="text-xs text-muted-foreground mt-1">이 기간 내 포스팅한 블로그만 대상</p>
              </div>
            </div>
            <Button><Search className="w-4 h-4 mr-2" /> 블로그 검색</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="apple-card p-6 space-y-6">
            <h3 className="font-semibold flex items-center gap-2"><Settings className="w-5 h-5" /> 자동화 설정</h3>
            <div className="space-y-4">
              <div>
                <Label>하루 최대 신청 수</Label>
                <Input type="number" defaultValue={50} className="w-32" />
                <p className="text-xs text-muted-foreground mt-1">네이버 제한에 걸리지 않도록 적절히 설정하세요</p>
              </div>
              <div>
                <Label>신청 간격 (초)</Label>
                <Input type="number" defaultValue={30} className="w-32" />
              </div>
              <div className="flex items-center justify-between">
                <Label>공감(좋아요) 자동 누르기</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>댓글 자동 작성</Label>
                <Switch defaultChecked />
              </div>
              <div>
                <Label>댓글 템플릿 (랜덤 사용)</Label>
                {commentTemplates.map((t, idx) => (
                  <Textarea key={idx} className="mt-2" value={t} onChange={e => {
                    const templates = [...commentTemplates];
                    templates[idx] = e.target.value;
                    setCommentTemplates(templates);
                  }} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeighborPage;
