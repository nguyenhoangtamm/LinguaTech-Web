import { Badge, IconButton } from "rsuite";
import MessagesDropdown from "@/layouts/messages-dropdown";
import NotificationDropdown from "@/layouts/notification-dropdown";
import ProfileMenu from "@/layouts/profile-menu";
import RingBellSolidIcon from "@/components/icons/ring-bell-solid";
import ChatSolidIcon from "@/components/icons/chat-solid";

export default function HeaderMenuRight() {
  return (
    <div className="ms-auto grid shrink-0 marker:items-center gap-2 text-gray-700 xs:gap-3 xl:gap-4">
      <ProfileMenu />
    </div>
  );
}
