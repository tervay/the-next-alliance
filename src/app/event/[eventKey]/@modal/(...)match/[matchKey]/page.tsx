import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
export default function Match({ params }: { params: { matchKey: string } }) {
  console.log('modal component');

  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>MY BIG FAT STUPID DIALOG</DialogTitle>
          <DialogDescription>AHHHHHHHHHHHHHHHHHH </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
