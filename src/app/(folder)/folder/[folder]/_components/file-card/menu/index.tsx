import { TFile } from "@schemas";
import { ContextMenuContent } from "@/ui/ux/context-menu";
import { FileCardMenuDelete } from "./delete";
import { FileCardMenuOpen } from "./open";
import { FileCardMenuSetAsPreview } from "./set-as-preview";

export const FileCardMenu = (props: TFile) => {
  return (
    <ContextMenuContent>
      <FileCardMenuOpen {...props} />
      <FileCardMenuSetAsPreview {...props} />
      <FileCardMenuDelete {...props} />
    </ContextMenuContent>
  );
};
