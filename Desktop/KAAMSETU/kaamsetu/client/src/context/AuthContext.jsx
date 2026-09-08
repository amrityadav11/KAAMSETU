import React, { createContext, useContext, useEffect, useReducer } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    token: localStorage.getItem('kaamsetu_token') || null,
    loading: true,
    isAuthenticated: false,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true, loading: false };
        case 'SET_TOKEN':
            return { ...state, token: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('kaamsetu_token');
            if (!token) {
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            try {
                const res = await api.get('/auth/me');
                dispatch({ type: 'SET_USER', payload: res.data.data.user });
            } catch {
                localStorage.removeItem('kaamsetu_token');
                dispatch({ type: 'LOGOUT' });
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user, token } = res.data.data;
        localStorage.setItem('kaamsetu_token', token);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        return user;
    };

    const register = async (data) => {
        const res = await api.post('/auth/register', data);
        const { user, token } = res.data.data;
        localStorage.setItem('kaamsetu_token', token);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        return user;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch { }
        localStorage.removeItem('kaamsetu_token');
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (userData) => {
        dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
