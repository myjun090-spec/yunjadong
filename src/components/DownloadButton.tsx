import { useState } from 'react';
import { Download, Apple, Monitor, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DownloadFile {
  name: string;
  path: string;
}

interface DownloadButtonProps {
  programName: string;
  description: string;
  folder: string;
  files: DownloadFile[];
  requirements: string[];
}

const DownloadButton = ({ programName, description, folder, files, requirements }: DownloadButtonProps) => {
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
          Python 프로그램 다운로드
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

          {/* 지원 플랫폼 */}
          <div className="flex gap-2">
            <Badge className="bg-blue-500/10 text-blue-500 gap-1">
              <Monitor className="w-3 h-3" /> Windows
            </Badge>
            <Badge className="bg-slate-500/10 text-slate-400 gap-1">
              <Apple className="w-3 h-3" /> macOS
            </Badge>
          </div>

          {/* 필수 요구사항 */}
          <div>
            <h4 className="text-sm font-medium mb-2">필수 요구사항</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* 파일 다운로드 */}
          <div>
            <h4 className="text-sm font-medium mb-2">파일 다운로드</h4>
            <div className="space-y-2">
              {files.map((file, i) => (
                <button
                  key={i}
                  onClick={() => handleDownload(file.path, file.name)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* 실행 방법 */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">실행 방법</h4>
            <div className="text-xs text-muted-foreground space-y-2">
              <div>
                <span className="font-medium text-foreground">Windows:</span>
                <code className="ml-2 bg-background px-2 py-0.5 rounded">run.bat</code> 더블클릭
              </div>
              <div>
                <span className="font-medium text-foreground">Mac/Linux:</span>
                <code className="ml-2 bg-background px-2 py-0.5 rounded">chmod +x run.sh && ./run.sh</code>
              </div>
              <div>
                <span className="font-medium text-foreground">직접 실행:</span>
                <code className="ml-2 bg-background px-2 py-0.5 rounded">pip install -r requirements.txt && python *.py</code>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadButton;
