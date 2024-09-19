import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './toggle-button';
import { BlackCard } from './blackCard';

export function ResizableVertical() {
  return (
    <ResizablePanelGroup
      direction="vertical"
      className=" max-w-sm rounded-md border md:min-w-[750px] mt-10 mb-10">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center">
          <span className="font-semibold flex justify-center items-center gap-2">
            <Button variant="default" size="sm">
              Start
            </Button>
            <Button variant="secondary" size="sm">
              Refresh
            </Button>
            <ModeToggle />
          </span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">
            <BlackCard />
          </span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
