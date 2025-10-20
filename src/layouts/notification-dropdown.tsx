"use client";

import { RefObject, useState } from "react";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Popover, Badge, Checkbox, Whisper } from "rsuite";
import TruckSolidIcon from "@/components/icons/truck-solid";
import BrushSolidIcon from "@/components/icons/brush-solid";
import CubeSolidIcon from "@/components/icons/cube-solid";
import FileStackIcon from "@/components/icons/file-stack";
import CloudTaskIcon from "@/components/icons/cloud-task";
import ShoppingBagSolidIcon from "@/components/icons/shopping-bag-solid";
import BulbSolidIcon from "@/components/icons/bulb-solid";
import ParcelMapIcon from "@/components/icons/parcel-map";
import Link from "next/link";
import { useMedia } from "@/hooks/use-media";
import SimpleBar from "@/components/ui/simplebar";
import { PiCheck } from "react-icons/pi";
import RingBellSolidIcon from "@/components/icons/ring-bell-solid";

dayjs.extend(relativeTime);

const data = [
  {
    id: 1,
    name: "Invitation for crafting engaging designs",
    icon: <RingBellSolidIcon />,
    unRead: true,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 2,
    name: "Isomorphic dashboard redesign",
    icon: <RingBellSolidIcon />,
    unRead: true,
    sendTime: "2023-05-30T09:35:31.820Z",
  },
  {
    id: 3,
    name: "3 New Incoming Project Files:",
    icon: <RingBellSolidIcon />,
    unRead: false,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 4,
    name: "Swornak purchased isomorphic",
    icon: <RingBellSolidIcon />,
    unRead: false,
    sendTime: "2023-05-21T09:35:31.820Z",
  },
  {
    id: 5,
    name: "Task #45890 merged with #45890 in “Ads Pro Admin Dashboard project:",
    icon: <RingBellSolidIcon />,
    unRead: true,
    sendTime: "2023-06-01T09:35:31.820Z",
  },
  {
    id: 6,
    name: "3 new application design concepts added",
    icon: <RingBellSolidIcon />,
    unRead: true,
    sendTime: "2023-05-15T09:35:31.820Z",
  },
  {
    id: 7,
    name: "Your order has been placed",
    icon: <RingBellSolidIcon />,
    unRead: false,
    sendTime: "2023-05-16T09:35:31.820Z",
  },
  {
    name: "Order has been shipped to #123221",
    icon: <RingBellSolidIcon />,
    unRead: false,
    sendTime: "2023-05-01T09:35:31.820Z",
  },
];

function NotificationsList({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-[320px] text-left sm:w-[360px] 2xl:w-[420px] rtl:text-right">
      <div className="mb-3 flex items-center justify-between ps-6">
        <h5 className="text-lg font-semibold">Thông báo</h5>
      </div>
      <SimpleBar className="max-h-[420px]">
        <div className="grid cursor-pointer grid-cols-1 gap-1 ps-4">
          {data.map((item) => (
            <div
              key={item.name + item.id}
              className="group grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md px-2 py-2 pe-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded bg-gray-100/70 p-1 dark:bg-gray-50/50 [&>svg]:h-auto [&>svg]:w-5">
                {item.icon}
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center">
                <div className="w-full">
                  <h6 className="mb-0.5 w-11/12 truncate text-sm font-semibold">
                    {item.name}
                  </h6>
                  <span className="ms-auto whitespace-nowrap pe-8 text-xs text-gray-500">
                    {/* @ts-ignore */}
                    {dayjs(item.sendTime).format("DD/MM/YYYY HH:mm:ss")}
                  </span>
                </div>
                <div className="ms-auto flex-shrink-0">
                  {item.unRead ? (
                    <Badge
                      className="scale-90 bg-blue-500"
                      content=""
                    />
                  ) : (
                    <span className="inline-block rounded-full bg-gray-100 p-0.5 dark:bg-gray-50">
                      <PiCheck className="h-auto w-[9px]" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SimpleBar>
      <Link
        href={"#"}
        onClick={() => setIsOpen(false)}
        className="-me-6 block px-6 pb-0.5 pt-3 text-center hover:underline"
      >
        Hiển thị toàn bộ
      </Link>
    </div>
  );
}

export default function NotificationDropdown({
  children,
}: {
  children: React.ReactElement & { ref?: RefObject<any> };
}) {
  const isMobile = useMedia("(max-width: 480px)", false);
  const [isOpen, setIsOpen] = useState(false);

  const speaker = (
    <Popover className="z-[9999] px-0 pb-4 pe-6 pt-5 dark:bg-gray-100">
      <NotificationsList setIsOpen={setIsOpen} />
    </Popover>
  );

  return (
    <Whisper
      trigger="click"
      placement={isMobile ? "bottom" : "bottomEnd"}
      speaker={speaker}
    >
      {children}
    </Whisper>
  );
}
