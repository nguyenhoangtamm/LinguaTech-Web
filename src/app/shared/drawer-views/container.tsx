'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Drawer } from 'rsuite';
import { useDrawer } from '@/app/shared/drawer-views/use-drawer';

export default function GlobalDrawer() {
  const { isOpen, view, placement, customSize, closeDrawer } = useDrawer();
  const pathname = usePathname();
  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      placement={placement || "left"}
      size={customSize || "md"}
      className="z-[9999]"
    >
      {view}
    </Drawer>
  );
}
