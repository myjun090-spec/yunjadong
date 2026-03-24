import { useState } from 'react';
import { Building2, Search, Download, Play, Pause, MapPin, Home, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DownloadButton from '@/components/DownloadButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Property {
  id: number;
  type: string;
  name: string;
  address: string;
  area: string;
  floor: string;
  price: string;
  deposit?: string;
  monthly?: string;
  dealType: '매매' | '전세' | '월세';
  source: string;
  collectedAt: string;
  imageUrl?: string;
}

const properties: Property[] = [
  { id: 1, type: '아파트', name: '래미안 퍼스티지', address: '서울 서초구 반포동', area: '84㎡', floor: '15/25층', price: '24억', dealType: '매매', source: '네이버부동산', collectedAt: '2024-01-15 14:00' },
  { id: 2, type: '아파트', name: '힐스테이트 클래시안', address: '서울 관악구 봉천동', area: '59㎡', floor: '8/20층', price: '9.5억', dealType: '매매', source: '네이버부동산', collectedAt: '2024-01-15 14:00' },
  { id: 3, type: '오피스텔', name: '강남 오피스텔', address: '서울 강남구 역삼동', area: '33㎡', floor: '12/18층', deposit: '5000만', monthly: '120만', dealType: '월세', source: '직방', collectedAt: '2024-01-15 13:30' },
  { id: 4, type: '아파트', name: '엘크루 블루오션', address: '부산 해운대구 우동', area: '84㎡', floor: '22/35층', price: '7.2억', dealType: '매매', source: '네이버부동산', collectedAt: '2024-01-15 13:00' },
  { id: 5, type: '빌라', name: '역삼 빌라', address: '서울 강남구 역삼동', area: '49㎡', floor: '3/4층', deposit: '3억', dealType: '전세', source: '다방', collectedAt: '2024-01-15 12:30' },
  { id: 6, type: '아파트', name: '마포 래미안', address: '서울 마포구 아현동', area: '59㎡', floor: '5/15층', price: '12.3억', dealType: '매매', source: '네이버부동산', collectedAt: '2024-01-15 12:00' },
  { id: 7, type: '오피스텔', name: '판교 오피스텔', address: '경기 성남시 판교동', area: '26㎡', floor: '7/15층', deposit: '3000만', monthly: '80만', dealType: '월세', source: '직방', collectedAt: '2024-01-15 11:30' },
  { id: 8, type: '아파트', name: '잠실 엘스', address: '서울 송파구 잠실동', area: '119㎡', floor: '20/33층', price: '27억', dealType: '매매', source: '네이버부동산', collectedAt: '2024-01-15 11:00' },
  { id: 9, type: '아파트', name: '둔촌 주공', address: '서울 강동구 둔촌동', area: '84㎡', floor: '10/25층', deposit: '8억', dealType: '전세', source: '네이버부동산', collectedAt: '2024-01-15 10:30' },
  { id: 10, type: '상가', name: '강남역 상가', address: '서울 강남구 역삼동', area: '66㎡', floor: '1/5층', deposit: '1억', monthly: '500만', dealType: '월세', source: '네이버부동산', collectedAt: '2024-01-15 10:00' },
];

const RealEstatePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dealFilter, setDealFilter] = useState('all');
  const [isRunning, setIsRunning] = useState(false);
  const [region, setRegion] = useState('서울');

  const filtered = properties.filter(p => {
    const matchSearch = p.name.includes(searchTerm) || p.address.includes(searchTerm);
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    const matchDeal = dealFilter === 'all' || p.dealType === dealFilter;
    const matchRegion = p.address.includes(region);
    return matchSearch && matchType && matchDeal && matchRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">부동산 수집 자동화</h1>
          <p className="text-muted-foreground text-sm">네이버부동산, 직방, 다방에서 매물 정보를 자동 수집합니다</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="부동산 수집 자동화"
            exeName="부동산수집_Windows.exe"
            description="네이버 부동산에서 매물 정보를 자동 수집하여 엑셀로 내보냅니다."
            folder="realestate"
            files={[
              { name: "realestate_auto.py", path: "/downloads/realestate/realestate_auto.py" },
              { name: "requirements.txt", path: "/downloads/realestate/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/realestate/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/realestate/run.bat" },
            ]}
            requirements={["Python 3.8+"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 수집 중지</> : <><Play className="w-4 h-4 mr-2" /> 수집 시작</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Home className="w-4 h-4" /> 수집 매물</div>
          <div className="text-2xl font-bold">{properties.length}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Building2 className="w-4 h-4" /> 매매</div>
          <div className="text-2xl font-bold">{properties.filter(p => p.dealType === '매매').length}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><DollarSign className="w-4 h-4" /> 전세/월세</div>
          <div className="text-2xl font-bold">{properties.filter(p => p.dealType !== '매매').length}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><TrendingUp className="w-4 h-4" /> 수집 소스</div>
          <div className="text-2xl font-bold">3개</div>
        </div>
      </div>

      {/* Crawl Settings */}
      <div className="apple-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Filter className="w-5 h-5" /> 수집 설정</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <Label>지역</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="서울">서울특별시</SelectItem>
                <SelectItem value="경기">경기도</SelectItem>
                <SelectItem value="부산">부산광역시</SelectItem>
                <SelectItem value="인천">인천광역시</SelectItem>
                <SelectItem value="대구">대구광역시</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>매물 유형</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="아파트">아파트</SelectItem>
                <SelectItem value="오피스텔">오피스텔</SelectItem>
                <SelectItem value="빌라">빌라</SelectItem>
                <SelectItem value="상가">상가</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>거래 유형</Label>
            <Select value={dealFilter} onValueChange={setDealFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="매매">매매</SelectItem>
                <SelectItem value="전세">전세</SelectItem>
                <SelectItem value="월세">월세</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>수집 주기</Label>
            <Select defaultValue="30">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10분마다</SelectItem>
                <SelectItem value="30">30분마다</SelectItem>
                <SelectItem value="60">1시간마다</SelectItem>
                <SelectItem value="360">6시간마다</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="매물명 또는 주소로 검색..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> 새로고침</Button>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> 엑셀 내보내기</Button>
      </div>

      {/* Table */}
      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유형</TableHead>
              <TableHead>매물명</TableHead>
              <TableHead>주소</TableHead>
              <TableHead>면적</TableHead>
              <TableHead>층</TableHead>
              <TableHead>거래</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>출처</TableHead>
              <TableHead>수집일시</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-sm"><MapPin className="w-3 h-3 inline mr-1" />{p.address}</TableCell>
                <TableCell>{p.area}</TableCell>
                <TableCell>{p.floor}</TableCell>
                <TableCell>
                  <Badge className={
                    p.dealType === '매매' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    p.dealType === '전세' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }>{p.dealType}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {p.price || `${p.deposit} / ${p.monthly}`}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.source}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.collectedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RealEstatePage;
