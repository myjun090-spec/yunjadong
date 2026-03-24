import { useState } from 'react';
import { FileText, Plus, Download, Printer, Search, Eye, CheckCircle2, Clock, Send, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Invoice {
  id: number;
  type: '견적서' | '거래명세서' | '세금계산서';
  number: string;
  client: string;
  items: number;
  totalAmount: number;
  tax: number;
  status: 'draft' | 'sent' | 'confirmed';
  createdAt: string;
  dueDate: string;
}

const initialInvoices: Invoice[] = [
  { id: 1, type: '거래명세서', number: 'INV-2024-001', client: '(주)테크솔루션', items: 5, totalAmount: 3500000, tax: 350000, status: 'confirmed', createdAt: '2024-01-15', dueDate: '2024-02-15' },
  { id: 2, type: '견적서', number: 'EST-2024-003', client: '스마트물류(주)', items: 3, totalAmount: 8200000, tax: 820000, status: 'sent', createdAt: '2024-01-14', dueDate: '2024-01-28' },
  { id: 3, type: '세금계산서', number: 'TAX-2024-002', client: '(주)디지털허브', items: 8, totalAmount: 12500000, tax: 1250000, status: 'confirmed', createdAt: '2024-01-13', dueDate: '2024-02-13' },
  { id: 4, type: '거래명세서', number: 'INV-2024-002', client: '푸드코리아(주)', items: 12, totalAmount: 4800000, tax: 480000, status: 'draft', createdAt: '2024-01-12', dueDate: '2024-02-12' },
  { id: 5, type: '견적서', number: 'EST-2024-004', client: '(주)빌드원', items: 2, totalAmount: 15000000, tax: 1500000, status: 'sent', createdAt: '2024-01-11', dueDate: '2024-01-25' },
  { id: 6, type: '세금계산서', number: 'TAX-2024-003', client: '(주)한국전자', items: 6, totalAmount: 7300000, tax: 730000, status: 'draft', createdAt: '2024-01-10', dueDate: '2024-02-10' },
  { id: 7, type: '거래명세서', number: 'INV-2024-003', client: '글로벌물산(주)', items: 4, totalAmount: 2100000, tax: 210000, status: 'confirmed', createdAt: '2024-01-09', dueDate: '2024-02-09' },
];

interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

const InvoicePage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const nextInvId = useRef(initialInvoices.length + 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newItems, setNewItems] = useState<InvoiceItem[]>([{ name: '', quantity: 1, unitPrice: 0 }]);
  const [newDocType, setNewDocType] = useState('거래명세서');
  const [newClient, setNewClient] = useState('');

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.includes(searchTerm) || inv.number.includes(searchTerm);
    const matchType = typeFilter === 'all' || inv.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalRevenue = invoices.filter(i => i.status === 'confirmed').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = invoices.filter(i => i.status !== 'confirmed').reduce((sum, i) => sum + i.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> 작성중</Badge>;
      case 'sent': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Send className="w-3 h-3 mr-1" /> 발송완료</Badge>;
      case 'confirmed': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> 확인완료</Badge>;
      default: return null;
    }
  };

  const addItem = () => setNewItems([...newItems, { name: '', quantity: 1, unitPrice: 0 }]);
  const newTotal = newItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">명세서 자동화</h1>
        <p className="text-muted-foreground text-sm">견적서, 거래명세서, 세금계산서를 자동으로 생성하고 관리합니다</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><FileText className="w-4 h-4" /> 총 문서</div>
          <div className="text-2xl font-bold">{invoices.length}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calculator className="w-4 h-4" /> 확인 매출</div>
          <div className="text-2xl font-bold text-emerald-500">{(totalRevenue / 10000).toLocaleString()}만원</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Clock className="w-4 h-4" /> 미확인 금액</div>
          <div className="text-2xl font-bold text-amber-500">{(pendingAmount / 10000).toLocaleString()}만원</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckCircle2 className="w-4 h-4" /> 확인율</div>
          <div className="text-2xl font-bold">{Math.round((invoices.filter(i => i.status === 'confirmed').length / invoices.length) * 100)}%</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="거래처 또는 문서번호 검색..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 문서</SelectItem>
            <SelectItem value="견적서">견적서</SelectItem>
            <SelectItem value="거래명세서">거래명세서</SelectItem>
            <SelectItem value="세금계산서">세금계산서</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> 새 문서 작성</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>새 명세서 작성</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>문서 유형</Label>
                  <Select value={newDocType} onValueChange={setNewDocType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="견적서">견적서</SelectItem>
                      <SelectItem value="거래명세서">거래명세서</SelectItem>
                      <SelectItem value="세금계산서">세금계산서</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>거래처</Label>
                  <Input placeholder="거래처명을 입력하세요" value={newClient} onChange={e => setNewClient(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>품목</Label>
                {newItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mt-2">
                    <Input placeholder="품목명" className="col-span-2" value={item.name} onChange={e => setNewItems(prev => prev.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))} />
                    <Input type="number" placeholder="수량" value={item.quantity} onChange={e => setNewItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Number(e.target.value) } : it))} />
                    <Input type="number" placeholder="단가" value={item.unitPrice} onChange={e => setNewItems(prev => prev.map((it, i) => i === idx ? { ...it, unitPrice: Number(e.target.value) } : it))} />
                  </div>
                ))}
                <Button variant="outline" className="mt-2 w-full" onClick={addItem}><Plus className="w-4 h-4 mr-2" /> 품목 추가</Button>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg flex justify-between">
                <span>합계 (VAT 별도)</span>
                <span className="font-bold">{newTotal.toLocaleString()}원</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {
                  if (!newClient) return;
                  const prefix = newDocType === '견적서' ? 'EST' : newDocType === '세금계산서' ? 'TAX' : 'INV';
                  const id = nextInvId.current++;
                  const totalAmount = newTotal;
                  setInvoices(prev => [{
                    id,
                    type: newDocType as Invoice['type'],
                    number: `${prefix}-2024-${String(id).padStart(3, '0')}`,
                    client: newClient,
                    items: newItems.filter(it => it.name).length,
                    totalAmount,
                    tax: Math.round(totalAmount * 0.1),
                    status: 'draft',
                    createdAt: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                  }, ...prev]);
                  setNewItems([{ name: '', quantity: 1, unitPrice: 0 }]);
                  setNewClient('');
                  setIsCreateOpen(false);
                }}>저장</Button>
                <Button variant="outline"><Printer className="w-4 h-4 mr-2" /> 인쇄</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> 엑셀 내보내기</Button>
      </div>

      {/* Table */}
      <div className="apple-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>문서번호</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>거래처</TableHead>
              <TableHead>품목수</TableHead>
              <TableHead>공급가액</TableHead>
              <TableHead>세액</TableHead>
              <TableHead>합계</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                <TableCell><Badge variant="outline">{inv.type}</Badge></TableCell>
                <TableCell className="font-medium">{inv.client}</TableCell>
                <TableCell>{inv.items}건</TableCell>
                <TableCell>{inv.totalAmount.toLocaleString()}원</TableCell>
                <TableCell className="text-muted-foreground">{inv.tax.toLocaleString()}원</TableCell>
                <TableCell className="font-bold">{(inv.totalAmount + inv.tax).toLocaleString()}원</TableCell>
                <TableCell>{getStatusBadge(inv.status)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{inv.createdAt}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2"><Eye className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2"><Printer className="w-3 h-3" /></Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2"><Download className="w-3 h-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoicePage;
