import { useState, useMemo } from 'react';
import { Users, Calendar, CheckCircle2, AlertTriangle, Plus, Download, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  skills: string[];
  availability: boolean;
  currentShift?: string;
}

interface Shift {
  id: number;
  date: string;
  time: string;
  location: string;
  required: number;
  assigned: number;
  employees: string[];
  status: 'full' | 'partial' | 'empty';
}

const employees: Employee[] = [
  { id: 1, name: '김민수', position: '팀장', department: '생산1팀', skills: ['용접', '조립', '검수'], availability: true, currentShift: '주간' },
  { id: 2, name: '이영희', position: '사원', department: '생산1팀', skills: ['포장', '검수'], availability: true, currentShift: '주간' },
  { id: 3, name: '박준호', position: '대리', department: '생산2팀', skills: ['용접', 'CNC'], availability: true, currentShift: '야간' },
  { id: 4, name: '최서연', position: '사원', department: '생산2팀', skills: ['조립', '포장'], availability: false },
  { id: 5, name: '정현우', position: '과장', department: '품질팀', skills: ['검수', '테스트'], availability: true, currentShift: '주간' },
  { id: 6, name: '강지은', position: '사원', department: '물류팀', skills: ['포장', '운송'], availability: true, currentShift: '주간' },
  { id: 7, name: '조태윤', position: '대리', department: '생산1팀', skills: ['용접', '조립', 'CNC'], availability: true, currentShift: '야간' },
  { id: 8, name: '윤소영', position: '사원', department: '품질팀', skills: ['검수'], availability: true },
  { id: 9, name: '한동건', position: '사원', department: '물류팀', skills: ['운송', '포장'], availability: false },
  { id: 10, name: '배수진', position: '팀장', department: '생산2팀', skills: ['CNC', '용접', '조립'], availability: true, currentShift: '주간' },
];

const shifts: Shift[] = [
  { id: 1, date: '2024-01-15', time: '주간 (08:00-17:00)', location: 'A동 생산라인', required: 5, assigned: 5, employees: ['김민수', '이영희', '정현우', '강지은', '배수진'], status: 'full' },
  { id: 2, date: '2024-01-15', time: '야간 (17:00-02:00)', location: 'A동 생산라인', required: 4, assigned: 3, employees: ['박준호', '조태윤', '윤소영'], status: 'partial' },
  { id: 3, date: '2024-01-15', time: '주간 (08:00-17:00)', location: 'B동 포장라인', required: 3, assigned: 3, employees: ['이영희', '강지은', '최서연'], status: 'full' },
  { id: 4, date: '2024-01-16', time: '주간 (08:00-17:00)', location: 'A동 생산라인', required: 5, assigned: 2, employees: ['김민수', '배수진'], status: 'partial' },
  { id: 5, date: '2024-01-16', time: '야간 (17:00-02:00)', location: 'A동 생산라인', required: 4, assigned: 0, employees: [], status: 'empty' },
  { id: 6, date: '2024-01-16', time: '주간 (08:00-17:00)', location: 'B동 포장라인', required: 3, assigned: 1, employees: ['강지은'], status: 'partial' },
];

const weekDays = ['월', '화', '수', '목', '금', '토', '일'];

const WorkforcePage = () => {
  const [currentWeek, setCurrentWeek] = useState('2024-01-15');
  const [deptFilter, setDeptFilter] = useState('all');

  const availableCount = employees.filter(e => e.availability).length;
  const totalRequired = shifts.reduce((sum, s) => sum + s.required, 0);
  const totalAssigned = shifts.reduce((sum, s) => sum + s.assigned, 0);
  const fillRate = Math.round((totalAssigned / totalRequired) * 100);

  const filteredEmployees = deptFilter === 'all' ? employees : employees.filter(e => e.department === deptFilter);

  // Pre-generate weekly schedule to avoid Math.random() in render
  const weeklySchedule = useMemo(() => {
    const schedule: Record<number, string[]> = {};
    employees.slice(0, 8).forEach(emp => {
      schedule[emp.id] = weekDays.map(() => {
        if (!emp.availability) return '휴';
        const rand = Math.random();
        if (rand < 0.3) return '휴';
        return rand < 0.65 ? '주' : '야';
      });
    });
    return schedule;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">인력배치 자동화</h1>
          <p className="text-muted-foreground text-sm">근무 스케줄과 인력 배치를 자동으로 최적화합니다</p>
        </div>
        <Button><RefreshCw className="w-4 h-4 mr-2" /> 자동 배치 실행</Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="w-4 h-4" /> 총 인원</div>
          <div className="text-2xl font-bold">{employees.length}명</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-1"><CheckCircle2 className="w-4 h-4" /> 근무 가능</div>
          <div className="text-2xl font-bold text-emerald-500">{availableCount}명</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calendar className="w-4 h-4" /> 배치율</div>
          <div className="text-2xl font-bold">{fillRate}%</div>
        </div>
        <div className="apple-card p-4">
          <div className="flex items-center gap-2 text-amber-500 mb-1"><AlertTriangle className="w-4 h-4" /> 미배치</div>
          <div className="text-2xl font-bold text-amber-500">{totalRequired - totalAssigned}명</div>
        </div>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList>
          <TabsTrigger value="schedule">근무 스케줄</TabsTrigger>
          <TabsTrigger value="employees">인원 관리</TabsTrigger>
          <TabsTrigger value="weekly">주간 배치표</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
              <span className="font-medium">2024년 1월 15일 ~ 21일</span>
              <Button variant="outline" size="sm"><ChevronRight className="w-4 h-4" /></Button>
            </div>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> 스케줄 내보내기</Button>
          </div>

          <div className="space-y-3">
            {shifts.map(shift => (
              <div key={shift.id} className={`apple-card p-4 border-l-4 ${
                shift.status === 'full' ? 'border-l-emerald-500' :
                shift.status === 'partial' ? 'border-l-amber-500' : 'border-l-red-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{shift.location}</span>
                      <Badge variant="outline">{shift.time}</Badge>
                      <Badge className={
                        shift.status === 'full' ? 'bg-emerald-500/10 text-emerald-500' :
                        shift.status === 'partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                      }>
                        {shift.assigned}/{shift.required}명
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {shift.date} · 배치: {shift.employees.length > 0 ? shift.employees.join(', ') : '미배치'}
                    </div>
                  </div>
                  {shift.status !== 'full' && (
                    <Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" /> 인원 추가</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="flex gap-3 mb-4">
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="부서 필터" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 부서</SelectItem>
                <SelectItem value="생산1팀">생산1팀</SelectItem>
                <SelectItem value="생산2팀">생산2팀</SelectItem>
                <SelectItem value="품질팀">품질팀</SelectItem>
                <SelectItem value="물류팀">물류팀</SelectItem>
              </SelectContent>
            </Select>
            <Button><Plus className="w-4 h-4 mr-2" /> 인원 추가</Button>
          </div>

          <div className="apple-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>직급</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>보유 기술</TableHead>
                  <TableHead>현재 근무</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell><Badge variant="outline">{emp.department}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {emp.skills.map(s => <Badge key={s} className="text-xs bg-primary/10 text-primary">{s}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell>{emp.currentShift || '-'}</TableCell>
                    <TableCell>
                      {emp.availability
                        ? <Badge className="bg-emerald-500/10 text-emerald-500">근무가능</Badge>
                        : <Badge className="bg-red-500/10 text-red-500">불가</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="apple-card p-6">
            <h3 className="font-semibold mb-4">주간 배치표</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">이름</th>
                    {weekDays.map(d => <th key={d} className="text-center p-2 border-b min-w-[80px]">{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 8).map(emp => (
                    <tr key={emp.id}>
                      <td className="p-2 border-b font-medium">{emp.name}</td>
                      {weekDays.map((d, idx) => {
                        const shift = weeklySchedule[emp.id]?.[idx] ?? '휴';
                        return (
                          <td key={d} className="text-center p-2 border-b">
                            <span className={`inline-block w-8 h-8 leading-8 rounded-lg text-xs font-medium ${
                              shift === '주' ? 'bg-blue-500/10 text-blue-500' :
                              shift === '야' ? 'bg-purple-500/10 text-purple-500' : 'bg-muted text-muted-foreground'
                            }`}>{shift}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500/20" /> 주간</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500/20" /> 야간</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-muted" /> 휴무</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforcePage;
