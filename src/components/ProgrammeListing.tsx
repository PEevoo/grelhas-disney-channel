import { ProgrammeEntry } from "@/types/listing";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";

interface ProgrammeListingProps {
  programmes: ProgrammeEntry[];
  selectedDate: string;
}

export const ProgrammeListing = ({ programmes, selectedDate }: ProgrammeListingProps) => {
  // Group programmes by block
  const groupedProgrammes: { block: string | null; programmes: ProgrammeEntry[] }[] = [];
  let currentBlock: string | null = null;
  let currentGroup: ProgrammeEntry[] = [];

  programmes.forEach((prog, index) => {
    const progBlock = prog.bloco.trim();
    
    if (progBlock && progBlock !== currentBlock) {
      // Start a new block
      if (currentGroup.length > 0) {
        groupedProgrammes.push({ block: currentBlock, programmes: currentGroup });
      }
      currentBlock = progBlock;
      currentGroup = [prog];
    } else if (!progBlock && currentBlock) {
      // End of block
      groupedProgrammes.push({ block: currentBlock, programmes: currentGroup });
      currentBlock = null;
      currentGroup = [prog];
    } else {
      // Continue current group
      currentGroup.push(prog);
    }
    
    // Push last group
    if (index === programmes.length - 1 && currentGroup.length > 0) {
      groupedProgrammes.push({ block: currentBlock, programmes: currentGroup });
    }
  });

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-foreground">TV Listings</h2>
        <p className="text-sm text-muted-foreground mt-1">{formatDate(selectedDate)}</p>
      </div>

      <div className="space-y-3">
        {groupedProgrammes.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.block ? (
              <Card className="bg-block border-block-border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="font-semibold">
                    {group.block}
                  </Badge>
                </div>
                {group.programmes.map((prog, progIndex) => (
                  <ProgrammeRow key={progIndex} programme={prog} isInBlock={true} />
                ))}
              </Card>
            ) : (
              group.programmes.map((prog, progIndex) => (
                <ProgrammeRow key={progIndex} programme={prog} isInBlock={false} />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgrammeRow = ({ programme, isInBlock }: { programme: ProgrammeEntry; isInBlock: boolean }) => {
  const isEstreia = programme.estreia.trim().toLowerCase() === 'sim' || programme.estreia.trim().toLowerCase() === 'x';
  
  return (
    <div className={`flex items-start gap-4 py-2 ${!isInBlock ? 'border-b border-border' : ''}`}>
      <div className="flex items-center gap-2 min-w-[80px]">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm font-medium text-foreground">
          {programme.hora}
        </span>
      </div>
      
      <div className="flex-1 flex items-center gap-2">
        <span className="text-foreground font-medium">{programme.programa}</span>
        {isEstreia && (
          <Badge variant="default" className="gap-1 bg-accent hover:bg-accent/90">
            <Star className="h-3 w-3" />
            Premiere
          </Badge>
        )}
      </div>
    </div>
  );
};
