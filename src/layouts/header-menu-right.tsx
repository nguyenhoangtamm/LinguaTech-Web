import { Badge, IconButton } from "rsuite";
import MessagesDropdown from "@/layouts/messages-dropdown";
import NotificationDropdown from "@/layouts/notification-dropdown";
import ProfileMenu from "@/layouts/profile-menu";
import RingBellSolidIcon from "@/components/icons/ring-bell-solid";
import ChatSolidIcon from "@/components/icons/chat-solid";

export default function HeaderMenuRight() {
  return (
    <div className="ms-auto grid shrink-0 grid-cols-2 marker:items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      {/* <MessagesDropdown>
        <IconButton
          appearance="subtle"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
          icon={<ChatSolidIcon className="h-[18px] w-auto" />}
        >
          <Badge
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2 bg-green-500"
            content=""
          />
        </IconButton>
      </MessagesDropdown> */}
      <NotificationDropdown>
        <IconButton
          appearance="subtle"
          className="relative h-[34px] w-[34px] shadow backdrop-blur-md md:h-9 md:w-9 dark:bg-gray-100"
          icon={<RingBellSolidIcon className="h-[18px] w-auto" />}
        >
          <Badge
            className="absolute right-2.5 top-2.5 -translate-y-1/3 translate-x-1/2 bg-orange-500"
            content=""
          />
        </IconButton>
      </NotificationDropdown>

      <ProfileMenu />
    </div>
  );
}
