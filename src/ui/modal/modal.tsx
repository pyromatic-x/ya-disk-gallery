"use client";

import { PropsWithChildren } from "react";
import { useDevice } from "@/hooks/use-device";
import { Dialog, DialogContent, DialogTitle } from "@/ui/modal/dialog";
import { Drawer, DrawerContent } from "@/ui/modal/drawer";

interface TProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;

  dialogProps?: Parameters<typeof DialogContent>[0];
  drawerProps?: Parameters<typeof DrawerContent>[0];

  testid?: string;
}

export const Modal = ({ open, onClose, children, dialogProps, drawerProps }: TProps) => {
  const { isDesktop } = useDevice();

  const handle_onClose = (state: boolean) => {
    if (state === false) onClose();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handle_onClose}>
        <DialogContent {...dialogProps}>
          <DialogTitle className="hidden pointer-none:" />
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent {...drawerProps}>
        <div className="mt-6 pb-10 px-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};
