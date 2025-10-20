"use client";

import cn from "@/utils/class-names";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useAppContext } from "@/components/app-provider";
import { useLogoutMutation } from "@/queries/useAuth";
import { handleErrorApi, removeTokensFromLocalStorage } from "@/lib/utils";
import UserItem from "./hydrogen/user-item";
import { Building, Languages, User } from "lucide-react";
import {
  Avatar,
  Button,
  Whisper,
  Popover,
  Dropdown,
  Loader,
  Notification,
  useToaster
} from "rsuite";
import { Admin, Exit } from "@rsuite/icons";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";

function ProfileDropdownContent() {
  const { setIsAuth } = useAppContext();
  const { data, isLoading, error } = useUserProfileMeQuery({ enabled: true });
  const logoutMutation = useLogoutMutation();
  const toaster = useToaster();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({
        refreshToken: localStorage.getItem("refreshToken") as string,
      });

      toaster.push(
        <Notification type="success" header="Thành công">
          Đăng xuất thành công
        </Notification>,
        { placement: 'topEnd' }
      );
    } catch (error) {
      handleErrorApi({ error });
      toaster.push(
        <Notification type="error" header="Lỗi">
          Có lỗi xảy ra khi đăng xuất
        </Notification>,
        { placement: 'topEnd' }
      );
    } finally {
      localStorage.removeItem("x-profile-code");
      removeTokensFromLocalStorage();
      localStorage.clear();
      setIsAuth(false);
      window.location.href = '/login';
    }
  };

  const profileData = data?.data;
  const displayName = profileData?.name || "Người dùng";

  return (
    <Popover style={{ width: 300 }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Admin style={{ fontSize: 16, color: '#666' }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
            Thông tin tài khoản
          </span>
        </div>

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <Loader size="sm" content="Đang tải..." />
          </div>
        )}

        {error && (
          <div style={{ color: '#f44336', fontSize: 12, padding: 8 }}>
            Đã xảy ra lỗi khi tải thông tin
          </div>
        )}

        {!isLoading && !error && profileData && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flex: 1,
              padding: 8,
              border: '1px solid #e0e0e0',
              borderRadius: 20,
              backgroundColor: '#fafafa'
            }}>
              <Avatar
                src={profileData.avatar || "/ltlogo.png"}
                size="xs"
                style={{ backgroundColor: '#10b981' }}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <div style={{ fontSize: 11, color: '#333', fontWeight: 500 }}>
                  {displayName}
                </div>
                {profileData.subName && (
                  <div style={{ fontSize: 10, color: '#666' }}>
                    {profileData.subName}
                  </div>
                )}
              </div>
            </div>

            <Button
              size="xs"
              appearance="ghost"
              color="red"
              startIcon={<Exit />}
              onClick={logout}
              loading={logoutMutation.isPending}
            >
              Đăng xuất
            </Button>
          </div>
        )}
      </div>
    </Popover>
  );
}

export default function ProfileMenu({
  buttonClassName,
  avatarClassName,
  username = false,
}: {
  buttonClassName?: string;
  avatarClassName?: string;
  username?: boolean;
}) {
  const pathname = usePathname();
  const { data } = useUserProfileMeQuery({ enabled: true });
  const profileData = data?.data;
  const displayName = profileData?.name || "User";

  return (
    <Whisper
      placement="bottomEnd"
      trigger="click"
      speaker={<ProfileDropdownContent />}
    >
      <Button
        appearance="subtle"
        className={cn(
          "!w-9 !h-9 sm:!w-10 sm:!h-10 shrink-0 rounded-full outline-none focus-visible:ring-[1.5px] focus-visible:ring-gray-400 focus-visible:ring-offset-2 active:translate-y-px mr-2 !p-0",
          buttonClassName
        )}
      >
        <Avatar
          src={profileData?.avatar || "/defaultuser.png"}
          size="sm"
          className={cn("!h-9 w-9 sm:!h-10 sm:!w-10", avatarClassName)}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        {!!username && (
          <span className="username hidden text-gray-200 md:inline-flex dark:text-gray-700 ml-2">
            Xin chào, {displayName}
          </span>
        )}
      </Button>
    </Whisper>
  );
}
