// components/UserSyncHandler.jsx
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const UserSyncHandler = () => {
    const { isSignedIn, user } = useUser();
    const { syncUserWithBackend } = useAppContext();

    useEffect(() => {
        if (isSignedIn && user) {
            // Sync user when they sign in
            syncUserWithBackend();
        }
    }, [isSignedIn, user]); // Run when sign-in state or user changes

    return null; // This component doesn't render anything
};

export default UserSyncHandler;