"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/app-provider";
import { useLogoutMutation } from "@/queries/useAuth";
import { handleErrorApi, removeTokensFromLocalStorage } from "@/lib/utils";
import UserItem from "./hydrogen/user-item";
import { Building, User, Settings, LogOut } from "lucide-react";
import { Button, Popover, Whisper, Avatar, IconButton } from "rsuite";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";
import { routes } from "@/config/routes";

function DropdownMenu() {
  const { setIsAuth } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useUserProfileMeQuery({ enabled: true });
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({
        refreshToken: localStorage.getItem("refreshToken") as string,
      });
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      localStorage.removeItem("x-profile-code");
      removeTokensFromLocalStorage();
      localStorage.clear();
      setIsAuth(false);
      window.location.href = '/login';
    }
  };

  const userData = data?.data ?? { fullname: "Người dùng", username: "" };
  console.log("userData:", userData);
  const showError = Boolean(error);

  return (
    <div style={{ width: '320px', textAlign: 'left' }}>
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '16px 16px 8px', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building style={{ height: '16px', width: '16px', color: '#6b7280' }} />
            <h3 style={{ fontSize: '12px', fontWeight: 500, color: '#1f2937', fontFamily: 'Inter' }}>
              Tài khoản
            </h3>
          </div>
        </div>

        {(isLoading || showError) && (
          <div style={{ fontSize: '12px', color: '#dc2626', padding: '0 12px' }}>
            {isLoading ? "Đang tải" : `Đã xảy ra lỗi: ${(error as Error)?.message}`}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <UserItem
              userName={userData?.username ?? ""}
              fullName={userData?.fullname ?? ""}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Button
              size="sm"
              appearance="ghost"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '14px' }}
              onClick={() => router.push(routes.user.profile)}
            >
              <User style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Hồ sơ cá nhân
            </Button>
            <Button
              size="sm"
              appearance="ghost"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '14px' }}
              onClick={() => router.push('/settings')}
            >
              <Settings style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Cài đặt
            </Button>
            <Button
              size="sm"
              appearance="ghost"
              color="red"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '14px' }}
              onClick={() => logout()}
            >
              <LogOut style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data, isLoading, error } = useUserProfileMeQuery({ enabled: true });
  const displayName = data?.data?.fullname || "Người dùng";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const popoverContent = <DropdownMenu />;

  return (
    <Whisper
      placement="bottomEnd"
      trigger="click"
      speaker={
        <Popover style={{ padding: 0, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          {popoverContent}
        </Popover>
      }
    >
      <IconButton
        icon={
          <Avatar
            size="md"
            circle
            style={{
              width: '36px',
              height: '36px',
              fontSize: '14px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="user-initial"
          >
            {((data?.data?.username?.[0] ?? displayName?.[0] ?? 'U')).toUpperCase()}
          </Avatar>
        }
        appearance="subtle"
        style={{
          padding: 0,
          marginRight: '8px',
          width: '36px',
          height: '36px',
          borderRadius: '50%'
        }}
      />
    </Whisper>
  );
}
