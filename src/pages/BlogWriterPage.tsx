import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Settings, Clock, CheckCircle2, XCircle, FileText, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DownloadButton from '@/components/DownloadButton';

interface BlogPost {
  id: number;
  title: string;
  keyword: string;
  status: 'draft' | 'generating' | 'ready' | 'posted' | 'failed';
  createdAt: string;
  postedAt?: string;
  wordCount: number;
  blog: string;
}

const initialPosts: BlogPost[] = [
  { id: 1, title: '2024 인테리어 트렌드 총정리', keyword: '인테리어 트렌드', status: 'posted', createdAt: '2024-01-15 09:00', postedAt: '2024-01-15 10:00', wordCount: 2340, blog: 'blog1' },
  { id: 2, title: '초보자를 위한 주식 투자 가이드', keyword: '주식 투자 초보', status: 'posted', createdAt: '2024-01-14 14:00', postedAt: '2024-01-14 15:30', wordCount: 3120, blog: 'blog1' },
  { id: 3, title: '건강한 아침 식사 레시피 10선', keyword: '건강 아침식사', status: 'ready', createdAt: '2024-01-15 11:00', wordCount: 1890, blog: 'blog2' },
  { id: 4, title: '재택근무 생산성 높이는 방법', keyword: '재택근무 팁', status: 'generating', createdAt: '2024-01-15 12:30', wordCount: 0, blog: 'blog1' },
  { id: 5, title: '서울 맛집 베스트 20', keyword: '서울 맛집 추천', status: 'draft', createdAt: '2024-01-15 13:00', wordCount: 0, blog: 'blog2' },
  { id: 6, title: '다이어트 식단 일주일 플랜', keyword: '다이어트 식단', status: 'failed', createdAt: '2024-01-13 16:00', wordCount: 0, blog: 'blog1' },
];

const BlogWriterPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [keyword, setKeyword] = useState('');
  const [blogId, setBlogId] = useState('blog1');
  const [autoPost, setAutoPost] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [postInterval, setPostInterval] = useState('60');
  const [isRunning, setIsRunning] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(65);

  const nextId = useRef(initialPosts.length + 1);

  const handleGenerate = () => {
    if (!keyword) return;
    const id = nextId.current++;
    const newPost: BlogPost = {
      id,
      title: `${keyword} 관련 블로그 포스트`,
      keyword,
      status: 'generating',
      createdAt: new Date().toLocaleString('ko-KR'),
      wordCount: 0,
      blog: blogId,
    };
    setPosts(prev => [newPost, ...prev]);
    setKeyword('');
    setGeneratingProgress(0);
    const interval = setInterval(() => {
      setGeneratingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);
    setTimeout(() => {
      clearInterval(interval);
      setGeneratingProgress(100);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'ready', wordCount: Math.floor(Math.random() * 2000) + 1500 } : p));
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="outline"><FileText className="w-3 h-3 mr-1" /> 초안</Badge>;
      case 'generating': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Sparkles className="w-3 h-3 mr-1 animate-spin" /> 생성중</Badge>;
      case 'ready': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> 작성완료</Badge>;
      case 'posted': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"><Send className="w-3 h-3 mr-1" /> 발행완료</Badge>;
      case 'failed': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="w-3 h-3 mr-1" /> 실패</Badge>;
      default: return null;
    }
  };

  const postedCount = posts.filter(p => p.status === 'posted').length;
  const readyCount = posts.filter(p => p.status === 'ready').length;
  const totalWords = posts.reduce((sum, p) => sum + p.wordCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2 tracking-tight">블로그 글쓰기 자동화</h1>
          <p className="text-muted-foreground text-sm">AI 기반 네이버 블로그 자동 포스팅 시스템</p>
        </div>
        <div className="flex gap-2">
          <DownloadButton
            programName="블로그 글쓰기 자동화"
            exeName="블로그자동화_Windows.exe"
            description="ChatGPT API로 AI 글을 생성하고 Selenium으로 네이버 블로그에 자동 포스팅합니다."
            folder="blog"
            files={[
              { name: "blog_auto.py", path: "/downloads/blog/blog_auto.py" },
              { name: "requirements.txt", path: "/downloads/blog/requirements.txt" },
              { name: "run.sh (Mac)", path: "/downloads/blog/run.sh" },
              { name: "run.bat (Windows)", path: "/downloads/blog/run.bat" },
            ]}
            requirements={["Python 3.8+", "Chrome 브라우저", "네이버 계정", "OpenAI API 키 (선택)"]}
          />
          <Button variant={isRunning ? 'destructive' : 'default'} onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <><Pause className="w-4 h-4 mr-2" /> 중지</> : <><Play className="w-4 h-4 mr-2" /> 자동 실행</>}
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="apple-card p-4">
          <div className="text-muted-foreground text-sm mb-1">발행 완료</div>
          <div className="text-2xl font-bold text-emerald-500">{postedCount}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-muted-foreground text-sm mb-1">발행 대기</div>
          <div className="text-2xl font-bold text-amber-500">{readyCount}건</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-muted-foreground text-sm mb-1">총 작성 글자수</div>
          <div className="text-2xl font-bold">{totalWords.toLocaleString()}자</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-muted-foreground text-sm mb-1">자동 포스팅</div>
          <div className="text-2xl font-bold">{isRunning ? <span className="text-emerald-500">실행중</span> : <span className="text-muted-foreground">중지됨</span>}</div>
        </div>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">글 생성</TabsTrigger>
          <TabsTrigger value="history">포스팅 내역</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="apple-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI 블로그 글 생성</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Label>키워드</Label>
                <Input placeholder="블로그 주제 키워드를 입력하세요" value={keyword} onChange={e => setKeyword(e.target.value)} />
              </div>
              <div>
                <Label>블로그 계정</Label>
                <Select value={blogId} onValueChange={setBlogId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog1">블로그 1 (메인)</SelectItem>
                    <SelectItem value="blog2">블로그 2 (서브)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={includeImages} onCheckedChange={setIncludeImages} />
                <Label>이미지 자동 생성</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={autoPost} onCheckedChange={setAutoPost} />
                <Label>자동 발행</Label>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={!keyword}><Sparkles className="w-4 h-4 mr-2" /> AI 글 생성</Button>
          </div>

          {posts.some(p => p.status === 'generating') && (
            <div className="apple-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                <span className="font-medium">글 생성 중...</span>
              </div>
              <Progress value={generatingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">ChatGPT API로 SEO 최적화 콘텐츠 생성 중... ({generatingProgress}%)</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="apple-card p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{post.title}</h4>
                    {getStatusBadge(post.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>키워드: {post.keyword}</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{post.createdAt}</span>
                    {post.wordCount > 0 && <span>{post.wordCount.toLocaleString()}자</span>}
                    {post.postedAt && <span className="text-emerald-500">발행: {post.postedAt}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.status === 'ready' && <Button size="sm"><Send className="w-3 h-3 mr-1" /> 발행</Button>}
                  {post.status === 'failed' && <Button size="sm" variant="outline">재시도</Button>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="apple-card p-6 space-y-6">
            <h3 className="font-semibold flex items-center gap-2"><Settings className="w-5 h-5" /> 자동화 설정</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label>포스팅 간격 (분)</Label>
                <Input type="number" value={postInterval} onChange={e => setPostInterval(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">글 발행 사이의 대기 시간</p>
              </div>
              <div>
                <Label>하루 최대 발행 수</Label>
                <Input type="number" defaultValue={5} />
                <p className="text-xs text-muted-foreground mt-1">하루에 발행할 최대 글 수</p>
              </div>
              <div>
                <Label>글 최소 길이 (자)</Label>
                <Input type="number" defaultValue={1500} />
              </div>
              <div>
                <Label>글 최대 길이 (자)</Label>
                <Input type="number" defaultValue={3000} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>이미지 자동 삽입</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>해시태그 자동 생성</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>발행 전 검수 필요</Label>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogWriterPage;
