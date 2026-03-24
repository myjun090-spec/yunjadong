import { useState } from 'react';
import { MessageCircle, Play, Pause, Plus, Trash2, Clock, CheckCircle2, Send, Users, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DownloadButton from '@/components/DownloadButton';

interface ChatRoom {
  id: number;
  name: string;
  type: 'personal' | 'group';
  members: number;
  lastSent?: string;
  enabled: boolean;
}

interface MessageTemplate {
  id: number;
  name: string;
  content: string;
  useCount: number;
}

interface SendLog {
  id: number;
  room: string;
  message: string;
  sentAt: string;
  status: 'success' | 'failed';
}

const initialRooms: ChatRoom[] = [
  { id: 1, name: '홍보 단톡방 1', type: 'group', members: 156, lastSent: '2024-01-15 14:30', enabled: true },
  { id: 2, name: '홍보 단톡방 2', type: 'group', members: 89, lastSent: '2024-01-15 14:30', enabled: true },
  { id: 3, name: '고객 안내방', type: 'group', members: 342, lastSent: '2024-01-15 13:00', enabled: true },
  { id: 4, name: '파트너 소통방', type: 'group', members: 45, lastSent: '2024-01-14 10:00', enabled: false },
  { id: 5, name: '김철수', type: 'personal', members: 1, lastSent: '2024-01-15 12:00', enabled: true },
  { id: 6, name: '이영희', type: 'personal', members: 1, lastSent: '2024-01-15 11:00', enabled: true },
  { id: 7, name: 'VIP 고객방', type: 'group', members: 67, enabled: true },
  { id: 8, name: '스터디 그룹', type: 'group', members: 23, enabled: false },
];

const initialTemplates: MessageTemplate[] = [
  { id: 1, name: '신상품 안내', content: '안녕하세요! 새로운 상품이 입고되었습니다. 지금 확인해보세요! 🛍️\n\n▶ 상품명: {product_name}\n▶ 가격: {price}원\n▶ 할인율: {discount}%\n\n👉 자세히 보기: {link}', useCount: 45 },
  { id: 2, name: '이벤트 공지', content: '🎉 특별 이벤트 안내 🎉\n\n{event_title}\n\n📅 기간: {start_date} ~ {end_date}\n🎁 혜택: {benefit}\n\n참여 방법은 아래 링크를 확인해주세요!\n👉 {link}', useCount: 32 },
  { id: 3, name: '정기 인사', content: '안녕하세요, {name}님! 😊\n오늘도 좋은 하루 보내세요.\n\n{custom_message}', useCount: 120 },
];

const initialLogs: SendLog[] = [
  { id: 1, room: '홍보 단톡방 1', message: '신상품 안내 메시지', sentAt: '2024-01-15 14:30', status: 'success' },
  { id: 2, room: '홍보 단톡방 2', message: '신상품 안내 메시지', sentAt: '2024-01-15 14:30', status: 'success' },
  { id: 3, room: '고객 안내방', message: '이벤트 공지 메시지', sentAt: '2024-01-15 13:00', status: 'success' },
  { id: 4, room: '파트너 소통방', message: '정기 인사 메시지', sentAt: '2024-01-14 10:00', status: 'failed' },
  { id: 5, room: '김철수', message: '정기 인사 메시지', sentAt: '2024-01-15 12:00', status: 'success' },
  { id: 6, room: '이영희', message: '신상품 안내 메시지', sentAt: '2024-01-15 11:00', status: 'success' },
];

const KakaoTalkPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);
  const [templates] = useState<MessageTemplate[]>(initialTemplates);
  const [logs] = useState<SendLog[]>(initialLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [interval, setIntervalMin] = useState('5');

  const enabledRooms = rooms.filter(r => r.enabled).length;
  const totalMembers = rooms.filter(r => r.enabled).reduce((sum, r) => sum + r.members, 0);
  const successRate = logs.length > 0 ? Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100) : 0;

  const toggleRoom = (id: number) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">카톡 자동화</h1>
          <p className="text-muted-foreground text-sm">카카오톡 대화방에 자동으로 메시지를 전송합니다</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="카톡 자동 발송기"
            exeName="카톡자동화_Windows.exe"
            description="카카오톡 PC/Mac 앱을 제어하여 대화방에 메시지를 자동으로 전송합니다."
            folder="kakao"
            files={[
              { name: "kakao_auto.py", path: "/downloads/kakao/kakao_auto.py" },
              { name: "requirements.txt", path: "/downloads/kakao/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/kakao/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/kakao/run.bat" },
            ]}
            requirements={["Python 3.8+", "카카오톡 PC/Mac 앱 로그인"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)} size="lg">
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 전송 중지</> : <><Play className="w-4 h-4 mr-2" /> 자동 전송 시작</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="w-4 h-4" /> 활성 대화방</div>
          <div className="text-2xl font-bold">{enabledRooms}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><MessageCircle className="w-4 h-4" /> 도달 인원</div>
          <div className="text-2xl font-bold">{totalMembers.toLocaleString()}명</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Send className="w-4 h-4" /> 전송 성공률</div>
          <div className="text-2xl font-bold text-emerald-500">{successRate}%</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Timer className="w-4 h-4" /> 전송 간격</div>
          <div className="text-2xl font-bold">{interval}분</div>
        </div>
      </div>

      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send">메시지 전송</TabsTrigger>
          <TabsTrigger value="rooms">대화방 관리</TabsTrigger>
          <TabsTrigger value="templates">메시지 템플릿</TabsTrigger>
          <TabsTrigger value="logs">전송 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-semibold">메시지 작성</h3>
            <div>
              <Label>템플릿 선택 (선택사항)</Label>
              <Select value={selectedTemplate} onValueChange={v => { setSelectedTemplate(v); const tmpl = templates.find(item => item.id.toString() === v); if (tmpl) setMessage(tmpl.content); }}>
                <SelectTrigger><SelectValue placeholder="템플릿을 선택하세요" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>메시지 내용</Label>
              <Textarea className="min-h-[150px]" placeholder="보낼 메시지를 입력하세요..." value={message} onChange={e => setMessage(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">{message.length}자 / 변수: {'{name}'}, {'{product_name}'}, {'{link}'} 등 사용 가능</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label>전송 간격 (분)</Label>
                <Input type="number" value={interval} onChange={e => setIntervalMin(e.target.value)} className="w-24" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch defaultChecked />
                <Label>이미지 첨부</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsRunning(true)} disabled={!message}><Send className="w-4 h-4 mr-2" /> 즉시 전송</Button>
              <Button variant="outline" onClick={() => setIsRunning(true)} disabled={!message}><Clock className="w-4 h-4 mr-2" /> 예약 전송</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="space-y-3">
            {rooms.map(room => (
              <div key={room.id} className="apple-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${room.type === 'group' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                    {room.type === 'group' ? <Users className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{room.name}</span>
                      <Badge variant="outline" className="text-xs">{room.type === 'group' ? '단체' : '개인'}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {room.members}명 {room.lastSent && `· 최근 전송: ${room.lastSent}`}
                    </div>
                  </div>
                </div>
                <Switch checked={room.enabled} onCheckedChange={() => toggleRoom(room.id)} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-3">
            {templates.map(template => (
              <div key={template.id} className="apple-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="outline">사용 {template.useCount}회</Badge>
                </div>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{template.content}</pre>
              </div>
            ))}
            <Button variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> 새 템플릿 추가</Button>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="apple-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                  <div>
                    <span className="font-medium text-sm">{log.room}</span>
                    <span className="text-xs text-muted-foreground ml-2">{log.message}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{log.sentAt}</span>
                  {log.status === 'success'
                    ? <Badge className="bg-emerald-500/10 text-emerald-500 text-xs">성공</Badge>
                    : <Badge className="bg-red-500/10 text-red-500 text-xs">실패</Badge>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KakaoTalkPage;
