import { IconButton } from "@/components/ui/IconButton";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <IconButton label="Create Playlist" size="md" tooltipSide="right">
        <Plus className="text-white" size={18}/>
      </IconButton>
      <h1 className="text-2xl">Spotify</h1>
    </div>
  );
}
