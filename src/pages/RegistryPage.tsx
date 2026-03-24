import { useState } from 'react';
import { FileCheck, Play, Pause, Plus, Download, Search, Clock, CheckCircle2, XCircle, AlertTriangle, Building, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DownloadButton from '@/components/DownloadButton';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface RegistryRequest {
  id: number;
  address: string;
  type: '토지' | '건물' | '집합건물';
  owner: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  documentUrl?: string;
}

const initialRequests: RegistryRequest[] = [
  { id: 1, address: '서울 강남구 역삼동 123-4', type: '건물', owner: '김OO', status: 'completed', requestedAt: '2024-01-15 10:00', completedAt: '2024-01-15 10:05', documentUrl: '#' },
  { id: 2, address: '서울 서초구 반포동 56-7', type: '집합건물', owner: '이OO', status: 'completed', requestedAt: '2024-01-15 10:10', completedAt: '2024-01-15 10:14', documentUrl: '#' },
  { id: 3, address: '서울 송파구 잠실동 89-1', type: '집합건물', owner: '박OO', status: 'processing', requestedAt: '2024-01-15 14:00' },
  { id: 4, address: '경기 성남시 분당구 서현동 234', type: '토지', owner: '최OO', status: 'pending', requestedAt: '2024-01-15 14:05' },
  { id: 5, address: '서울 마포구 서교동 345-6', type: '건물', owner: '정OO', status: 'completed', requestedAt: '2024-01-14 09:00', completedAt: '2024-01-14 09:06', documentUrl: '#' },
  { id: 6, address: '서울 용산구 이태원동 78-9', type: '토지', owner: '강OO', status: 'failed', requestedAt: '2024-01-14 11:00' },
  { id: 7, address: '부산 해운대구 우동 567', type: '집합건물', owner: '조OO', status: 'completed', requestedAt: '2024-01-13 15:00', completedAt: '2024-01-13 15:04', documentUrl: '#' },
  { id: 8, address: '서울 강동구 천호동 111-2', type: '건물', owner: '윤OO', status: 'completed', requestedAt: '2024-01-13 16:00', completedAt: '2024-01-13 16:05', documentUrl: '#' },
];

const RegistryPage = () => {
  const [requests, setRequests] = useState<RegistryRequest[]>(initialRequests);
  const [isRunning, setIsRunning] = useState(false);
  const [bulkAddresses, setBulkAddresses] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const completed = requests.filter(r => r.status === 'completed').length;
  const processing = requests.filter(r => r.status === 'processing' || r.status === 'pending').length;
  const failed = requests.filter(r => r.status === 'failed').length;

  const filtered = requests.filter(r =>
    r.address.includes(searchTerm) || r.owner.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> 대기중</Badge>;
      case 'processing': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> 발급중</Badge>;
      case 'completed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> 발급완료</Badge>;
      case 'failed': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> 실패</Badge>;
      default: return null;
    }
  };

  const handleBulkAdd = () => {
    const addresses = bulkAddresses.split('\n').filter(a => a.trim());
    const nextId = Math.max(0, ...requests.map(r => r.id));
    const newRequests = addresses.map((addr, idx) => ({
      id: nextId + idx + 1,
      address: addr.trim(),
      type: '건물' as const,
      owner: '-',
      status: 'pending' as const,
      requestedAt: new Date().toLocaleString('ko-KR'),
    }));
    setRequests([...newRequests, ...requests]);
    setBulkAddresses('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">등기부등본 발급 자동화</h1>
          <p className="text-muted-foreground text-sm">인터넷등기소에서 등기부등본을 자동으로 발급합니다</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="등기부등본 자동 발급"
            exeName="등기부등본_Windows.exe"
            description="인터넷등기소에서 등기부등본을 자동으로 발급합니다."
            folder="registry"
            files={[
              { name: "registry_auto.py", path: "/downloads/registry/registry_auto.py" },
              { name: "requirements.txt", path: "/downloads/registry/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/registry/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/registry/run.bat" },
            ]}
            requirements={["Python 3.8+", "Chrome 브라우저", "인터넷등기소 계정"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 중지</> : <><Play className="w-4 h-4 mr-2" /> 자동 발급 시작</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><FileCheck className="w-4 h-4" /> 총 요청</div>
          <div className="text-2xl font-bold">{requests.length}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-1"><CheckCircle2 className="w-4 h-4" /> 발급완료</div>
          <div className="text-2xl font-bold text-emerald-500">{completed}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-blue-500 mb-1"><Clock className="w-4 h-4" /> 대기/처리중</div>
          <div className="text-2xl font-bold text-blue-500">{processing}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-red-500 mb-1"><AlertTriangle className="w-4 h-4" /> 실패</div>
          <div className="text-2xl font-bold text-red-500">{failed}건</div>
        </div>
      </div>

      {isRunning && (
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="font-medium">자동 발급 진행중...</span>
            <span className="text-sm text-muted-foreground">3/8 건 처리중</span>
          </div>
          <Progress value={37.5} className="h-2" />
        </div>
      )}

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">발급 내역</TabsTrigger>
          <TabsTrigger value="bulk">일괄 등록</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="주소 또는 소유자 검색..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> 전체 다운로드</Button>
          </div>

          <div className="apple-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주소</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>소유자</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>요청일시</TableHead>
                  <TableHead>완료일시</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(req => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium"><Building className="w-3 h-3 inline mr-1" />{req.address}</TableCell>
                    <TableCell><Badge variant="outline">{req.type}</Badge></TableCell>
                    <TableCell>{req.owner}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{req.requestedAt}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{req.completedAt || '-'}</TableCell>
                    <TableCell>
                      {req.status === 'completed' && (
                        <Button size="sm" variant="outline" className="h-7"><Download className="w-3 h-3 mr-1" /> PDF</Button>
                      )}
                      {req.status === 'failed' && (
                        <Button size="sm" variant="outline" className="h-7"><RefreshCw className="w-3 h-3 mr-1" /> 재시도</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-semibold">일괄 주소 등록</h3>
            <p className="text-sm text-muted-foreground">한 줄에 하나의 주소를 입력하세요. 입력된 주소의 등기부등본을 일괄 발급합니다.</p>
            <Textarea
              className="min-h-[200px] font-mono"
              placeholder={`서울 강남구 역삼동 123-4\n서울 서초구 반포동 56-7\n경기 성남시 분당구 서현동 234`}
              value={bulkAddresses}
              onChange={e => setBulkAddresses(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {bulkAddresses.split('\n').filter(a => a.trim()).length}개 주소 입력됨
              </span>
              <Button onClick={handleBulkAdd} disabled={!bulkAddresses.trim()}>
                <Plus className="w-4 h-4 mr-2" /> 일괄 등록
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistryPage;
