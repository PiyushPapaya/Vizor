import { memo } from 'react';
import { ProjectVersion } from '@/hooks/useAutosave';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, RotateCcw, Trash2, Clock, Save
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryProps {
  versions: ProjectVersion[];
  onRestore: (versionId: string) => void;
  onDelete: (versionId: string) => void;
  onClearAll: () => void;
  lastSaved: Date | null;
  isSaving: boolean;
}

function VersionHistory({ 
  versions, 
  onRestore, 
  onDelete, 
  onClearAll,
  lastSaved,
  isSaving 
}: VersionHistoryProps) {
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary/10">
            <History className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold">Version History</span>
        </div>
        {isSaving ? (
          <Badge variant="secondary" className="text-[10px] h-5 gap-1 animate-pulse">
            <Save className="h-3 w-3" />
            Saving...
          </Badge>
        ) : lastSaved ? (
          <Badge variant="outline" className="text-[10px] h-5 gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(lastSaved, { addSuffix: true })}
          </Badge>
        ) : null}
      </div>

      {/* Versions List */}
      {versions.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">
          No versions saved yet. Changes are auto-saved every 5 seconds.
        </p>
      ) : (
        <>
          <ScrollArea className="h-48">
            <div className="space-y-1.5 pr-2">
              {sortedVersions.map((version, index) => (
                <div 
                  key={version.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-border/30 hover:border-primary/25 hover:bg-muted/20 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate">
                        {version.name}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestore(version.id)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(version.id)}
                      className="h-7 w-7 p-0 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="w-full h-8 text-xs text-muted-foreground hover:text-destructive rounded-lg border-border/30 hover:border-destructive/30"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear All Versions
          </Button>
        </>
      )}
    </div>
  );
}

export default memo(VersionHistory);
