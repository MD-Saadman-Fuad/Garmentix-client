import { useState, useEffect, useRef } from 'react';
import useAuth from './useAuth';

/**
 * useUserRole — fetches and caches the current user's role and status.
 *
 * Previously, this fetch was inside ProductsCard, causing N+1 API calls:
 * e.g. 8 featured products = 8 identical "/users/:email" requests.
 *
 * This hook caches the result in a module-level Map so the request fires
 * only ONCE per user email per page session, regardless of how many
 * ProductsCard components are mounted.
 */

// Module-level cache — survives re-renders and component remounts
const roleCache = new Map(); // email -> { role, status }

const useUserRole = () => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [roleLoading, setRoleLoading] = useState(false);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!user?.email) {
            setUserRole(null);
            setUserStatus(null);
            return;
        }

        // Return cached result immediately — no extra network request
        if (roleCache.has(user.email)) {
            const cached = roleCache.get(user.email);
            setUserRole(cached.role);
            setUserStatus(cached.status);
            return;
        }

        // Prevent duplicate in-flight requests from the same component instance
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        setRoleLoading(true);
        fetch(`${import.meta.env.VITE_backend_url}/users/${user.email}`)
            .then(res => res.json())
            .then(data => {
                const result = { role: data.role, status: data.status };
                // Populate cache so every other mounted card gets it free
                roleCache.set(user.email, result);
                setUserRole(result.role);
                setUserStatus(result.status);
            })
            .catch(err => console.error('useUserRole error:', err))
            .finally(() => setRoleLoading(false));
    }, [user?.email]);

    // Clear cache on logout (email becomes null)
    useEffect(() => {
        if (!user?.email) {
            roleCache.clear();
            fetchedRef.current = false;
        }
    }, [user?.email]);

    return { userRole, userStatus, roleLoading };
};

export default useUserRole;
