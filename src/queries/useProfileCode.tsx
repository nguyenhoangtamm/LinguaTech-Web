// hooks/useProfileCode.ts
import { useEffect, useState } from "react";

export function useProfileCode() {
    const [hasProfileCode, setHasProfileCode] = useState<boolean>(true);
    const [profileCode, setProfileCode] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const code = localStorage.getItem("x-profile-code");
            setProfileCode(code);
            setHasProfileCode(!!code);
        }
    }, []);

    return { hasProfileCode, profileCode };
}
