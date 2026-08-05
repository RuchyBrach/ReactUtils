import { useEffect } from "react";
import { getUserStore } from "./UserStore";
import { Navigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";

interface SessionTimeoutProps {
    apiurl: string;
    timeout: number;
    pathtologin: string;
}

export function useSessionTimeout({ apiurl, timeout, pathtologin }: SessionTimeoutProps) {
    const useUserStore = getUserStore(apiurl);
    const isLoggedIn = useUserStore(state => state.isLoggedIn);
    const logout = useUserStore((state) => state.logout);
    const username = useUserStore((state) => state.userName);

    const handleOnIdle = async () => {
        if (isLoggedIn) {
            await logout(username);
            if (pathtologin) {
                Navigate({ to: pathtologin });
            }
        }
    };

    const { start, reset } = useIdleTimer({
        timeout,
        onIdle: handleOnIdle,
        debounce: 500
    });

    useEffect(() => {
        if (isLoggedIn) {
            start();
        }
        else {
            reset();
        }
    }, [isLoggedIn, start, reset]);
}