import { useState } from 'react';
import { Download, Apple, Monitor, Terminal, FileText, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const GITHUB_RELEASES_URL = "https://github.com/myjun090-spec/yunjadong/releases/latest";

interface DownloadFile {
  name: string;
  path: string;
}

interface DownloadButtonProps {
  programName: string;
  description: string;
  folder: string;
  exeName: string;
  files: DownloadFile[];
  requirements: string[];
}

const DownloadButton = ({ programName, description, folder, exeName, files, requirements }: DownloadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = (path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          프로그램 다운로드
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            {programName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex gap-2">
            <Badge className="bg-blue-500/10 text-blue-500 gap-1">
              <Monitor className="w-3 h-3" /> Windows
            </Badge>
            <Badge className="bg-slate-500/10 text-slate-400 gap-1">
              <Apple className="w-3 h-3" /> macOS
            </Badge>
          </div>

          <Tabs defaultValue="exe">
            <TabsList className="w-full">
              <TabsTrigger value="exe" className="flex-1">실행파일 (.exe / .app)</TabsTrigger>
              <TabsTrigger value="python" className="flex-1">Python 소스</TabsTrigger>
            </TabsList>

            <TabsContent value="exe" className="space-y-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2 text-emerald-600">설치 없이 바로 실행!</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Python 설치 없이 더블클릭으로 바로 실행할 수 있습니다.
                </p>
                <a
                  href={GITHUB_RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  {exeName} 다운로드
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  GitHub Releases에서 Windows (.exe) / Mac 버전을 선택하세요.
                </p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-xs font-medium mb-1">실행 방법</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><span className="font-medium text-foreground">Windows:</span> .exe 파일 더블클릭</div>
                  <div><span className="font-medium text-foreground">Mac:</span> 다운로드 → 우클릭 → 열기 (보안 허용)</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="python" className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">필수 요구사항</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {requirements.map((req, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                {files.map((file, i) => (
                  <button
                    key={i}
                    onClick={() => handleDownload(file.path, file.name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-xs font-medium mb-1">실행 방법</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div><span className="font-medium text-foreground">Windows:</span> <code className="bg-background px-1 rounded">run.bat</code> 더블클릭</div>
                  <div><span className="font-medium text-foreground">Mac:</span> <code className="bg-background px-1 rounded">chmod +x run.sh && ./run.sh</code></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadButton;
