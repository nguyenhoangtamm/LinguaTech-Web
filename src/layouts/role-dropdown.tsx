"use client";

import { Button } from "rsuite";
import { Shield } from "lucide-react";
import { useUserProfileMeQuery } from "@/queries/useUserProfile";

export default function RoleDisplay() {
    const { data, isLoading } = useUserProfileMeQuery({ enabled: true });
    const currentRole = data?.data?.roles?.[0] || { code: "User", displayName: "Người dùng" }; // Giả sử role đầu tiên là current

    if (isLoading) {
        return (
            <Button
                appearance="subtle"
                style={{
                    padding: '4px 8px',
                    marginRight: '8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151'
                }}
                disabled
            >
                <Shield style={{ height: '14px', width: '14px', marginRight: '4px' }} />
                Đang tải...
            </Button>
        );
    }

    return (
        <Button
            appearance="subtle"
            style={{
                padding: '4px 8px',
                marginRight: '8px',
                borderRadius: '6px',
                fontSize: '12px',
                backgroundColor: '#f3f4f6',
                color: '#374151'
            }}
            disabled
        >
            <Shield style={{ height: '14px', width: '14px', marginRight: '4px' }} />
            {currentRole.displayName || currentRole.code}
        </Button>
    );
}