import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve everything on page refresh
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const rollNo = localStorage.getItem('rollNo'); // Added this
        
        if (token && role) {
            setUser({ token, role, username, rollNo }); // Include rollNo in state
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Backend returns: { token: "...", user: { id, name, role, rollNo } }
        const { token, user: profile } = userData;

        // Save to LocalStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('role', profile.role);
        localStorage.setItem('username', profile.email || profile.username);
        localStorage.setItem('rollNo', profile.rollNo || ''); // Save the Roll Number!

        // Update Global State
        setUser({ 
            token, 
            role: profile.role, 
            username: profile.email || profile.username,
            rollNo: profile.rollNo // Critical for Parent Dashboard
        });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);