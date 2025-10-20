"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { profile } from "console";

interface UserItemProps {
  profileCode: string;
  subName: string;
  status: number;
  type: number;
  name: string;
  avatar?: string;
}

function UserItem({
  profileCode,
  name,
  subName,
  status,
  type,
  avatar,
}: UserItemProps) {
  // const avatarDefault = avatar || "/ltlogo.png";
  return (
    <div className="flex items-center gap-1 rounded-[6px] hover:cursor-pointer pt-1 pb-1">
      <div className="avatar rounded-full h-5 w-5 bg-emerald-700 text-white font-[700] flex items-center justify-center overflow-hidden">
        <Image
          src="/ltlogo.png"
          alt="User Avatar"
          width={36}
          height={36}
          className="rounded-full"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="flex items-center gap-1">
        <div className="grow px-2" style={{ lineHeight: "1.2" }}>
          <p className="text-[12px] font-bold pb-1">{name}</p>
          <p className="text-[11px] text-neutral-700">{subName}</p>
        </div>
      </div>
    </div>
  );
}
interface UserListProps {
  users?: UserItemProps[];
}
export default function UserList({ users }: UserListProps) {
  const router = useRouter();

  const handleAccessProfile = (profileCode: string) => {
    localStorage.setItem("x-profile-code", profileCode);
    router.push(routes.manage.dashboard);
  };

  return (
    <div className="w-full">
      <Table className="w-full">
        <TableBody>
          {users &&
            users.map((user) => (
              <TableRow key={user.profileCode}>
                <TableCell
                  className="px-5 py-2"
                // onClick={() => handleAccessProfile(user.profileCode)}
                >
                  <UserItem {...user} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
