import { useState } from 'react';
import { Package, Plus, Search, Download, Upload, Trash2, BarChart3, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface InventoryItem {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  location: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'out';
}

const initialInventory: InventoryItem[] = [
  { id: 1, code: 'PRD-001', name: 'A4 복사용지 (500매)', category: '사무용품', quantity: 150, minQuantity: 50, price: 5500, location: 'A-1-01', lastUpdated: '2024-01-15', status: 'normal' },
  { id: 2, code: 'PRD-002', name: '볼펜 (검정)', category: '사무용품', quantity: 30, minQuantity: 100, price: 800, location: 'A-1-02', lastUpdated: '2024-01-14', status: 'low' },
  { id: 3, code: 'PRD-003', name: '토너 카트리지 (HP)', category: '소모품', quantity: 0, minQuantity: 5, price: 85000, location: 'B-2-01', lastUpdated: '2024-01-13', status: 'out' },
  { id: 4, code: 'PRD-004', name: '포스트잇 (노랑)', category: '사무용품', quantity: 200, minQuantity: 50, price: 2500, location: 'A-1-03', lastUpdated: '2024-01-15', status: 'normal' },
  { id: 5, code: 'PRD-005', name: '마우스 (무선)', category: '전자기기', quantity: 15, minQuantity: 10, price: 25000, location: 'C-1-01', lastUpdated: '2024-01-12', status: 'normal' },
  { id: 6, code: 'PRD-006', name: '키보드 (기계식)', category: '전자기기', quantity: 8, minQuantity: 10, price: 89000, location: 'C-1-02', lastUpdated: '2024-01-11', status: 'low' },
  { id: 7, code: 'PRD-007', name: '모니터 (27인치)', category: '전자기기', quantity: 5, minQuantity: 3, price: 350000, location: 'C-2-01', lastUpdated: '2024-01-10', status: 'normal' },
  { id: 8, code: 'PRD-008', name: '화이트보드 마커', category: '사무용품', quantity: 0, minQuantity: 20, price: 1500, location: 'A-2-01', lastUpdated: '2024-01-09', status: 'out' },
  { id: 9, code: 'PRD-009', name: 'USB 메모리 (64GB)', category: '전자기기', quantity: 25, minQuantity: 10, price: 12000, location: 'C-1-03', lastUpdated: '2024-01-15', status: 'normal' },
  { id: 10, code: 'PRD-010', name: '택배 박스 (중)', category: '포장재', quantity: 45, minQuantity: 100, price: 1200, location: 'D-1-01', lastUpdated: '2024-01-14', status: 'low' },
];

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', code: '', category: '사무용품', quantity: 0, minQuantity: 0, price: 0, location: '' });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.status === 'low').length;
  const outOfStockItems = inventory.filter(i => i.status === 'out').length;
  const totalValue = inventory.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.code) return;
    const status = newItem.quantity === 0 ? 'out' : newItem.quantity < newItem.minQuantity ? 'low' : 'normal';
    setInventory(prev => [...prev, {
      id: Math.max(0, ...prev.map(i => i.id)) + 1,
      ...newItem,
      lastUpdated: new Date().toISOString().split('T')[0],
      status,
    }]);
    setNewItem({ name: '', code: '', category: '사무용품', quantity: 0, minQuantity: 0, price: 0, location: '' });
    setIsAddDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleInbound = (id: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + 10;
        return { ...item, quantity: newQty, status: newQty === 0 ? 'out' : newQty < item.minQuantity ? 'low' : 'normal', lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));
  };

  const handleOutbound = (id: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity - 1);
        return { ...item, quantity: newQty, status: newQty === 0 ? 'out' : newQty < item.minQuantity ? 'low' : 'normal', lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return item;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">정상</Badge>;
      case 'low': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">부족</Badge>;
      case 'out': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">품절</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">엑셀 재고관리 자동화</h1>
        <p className="text-muted-foreground text-sm">입고/출고/재고 현황을 자동으로 관리하고 통계를 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Package className="w-4 h-4" /> 총 품목</div>
          <div className="text-2xl font-bold">{totalItems}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-amber-500 mb-1"><AlertTriangle className="w-4 h-4" /> 재고 부족</div>
          <div className="text-2xl font-bold text-amber-500">{lowStockItems}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-red-500 mb-1"><AlertTriangle className="w-4 h-4" /> 품절</div>
          <div className="text-2xl font-bold text-red-500">{outOfStockItems}개</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><BarChart3 className="w-4 h-4" /> 총 자산가치</div>
          <div className="text-2xl font-bold">{totalValue.toLocaleString()}원</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="품목명 또는 코드로 검색..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="카테고리" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            <SelectItem value="사무용품">사무용품</SelectItem>
            <SelectItem value="전자기기">전자기기</SelectItem>
            <SelectItem value="소모품">소모품</SelectItem>
            <SelectItem value="포장재">포장재</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="상태" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="normal">정상</SelectItem>
            <SelectItem value="low">부족</SelectItem>
            <SelectItem value="out">품절</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> 품목 추가</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>새 품목 추가</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>품목 코드</Label><Input value={newItem.code} onChange={e => setNewItem({ ...newItem, code: e.target.value })} placeholder="PRD-011" /></div>
              <div><Label>품목명</Label><Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="품목명을 입력하세요" /></div>
              <div><Label>카테고리</Label>
                <Select value={newItem.category} onValueChange={v => setNewItem({ ...newItem, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사무용품">사무용품</SelectItem>
                    <SelectItem value="전자기기">전자기기</SelectItem>
                    <SelectItem value="소모품">소모품</SelectItem>
                    <SelectItem value="포장재">포장재</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>수량</Label><Input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: Number(e.target.value) })} /></div>
                <div><Label>최소 수량</Label><Input type="number" value={newItem.minQuantity} onChange={e => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>단가 (원)</Label><Input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })} /></div>
                <div><Label>위치</Label><Input value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} placeholder="A-1-01" /></div>
              </div>
              <Button className="w-full" onClick={handleAddItem}>추가</Button>
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
              <TableHead>코드</TableHead>
              <TableHead>품목명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>재고</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>단가</TableHead>
              <TableHead>위치</TableHead>
              <TableHead>최종 수정</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.code}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span className="font-medium">{item.quantity} / {item.minQuantity}</span>
                    <Progress value={item.minQuantity > 0 ? Math.min((item.quantity / item.minQuantity) * 100, 100) : 0} className="h-1.5" />
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.price.toLocaleString()}원</TableCell>
                <TableCell className="font-mono text-xs">{item.location}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => handleInbound(item.id)}>
                      <Upload className="w-3 h-3 mr-1" /> 입고
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => handleOutbound(item.id)}>
                      <Download className="w-3 h-3 mr-1" /> 출고
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
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

export default InventoryPage;
