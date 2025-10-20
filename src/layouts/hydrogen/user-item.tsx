"use client";
import Image from "next/image";
type UserItemProps = {
  userName: string;
  fullName: string;

};
export default function UserItem({ fullName, userName }: UserItemProps) {
  return (
    <div className="inline-flex items-center gap-2 border rounded-[20px] px-2 py-1 shadow-sm hover:bg-gray-50 transition-all duration-200 hover:cursor-pointer">
      <div className="avatar rounded-full h-5 w-5 bg-emerald-500 text-white font-[700] flex items-center justify-center overflow-hidden">
        <Image
          src="/ltlogo.png"
          alt="User Avatar"
          width={24}
          height={24}
          className="rounded-full"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div className="grow leading-tight px-1">
        {/* <p className="text-[11px] font-bold">anhdev99</p> */}
        <p className="text-[11px]  text-neutral-800">{userName}</p>
      </div>
    </div>
  );
}
