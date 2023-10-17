import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";


const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    const csrf = () => api.get('sanctum/csrf-cookie');
    
    const getUser = useCallback(async () => {
        try {
            const {data} = await api.get('/api/user');
            setUser(data);
        } catch (error) {
            console.error("Failed to get user:", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const login = async ({email, password}) => {
        await csrf();
        try {
            await api.post('/login', {email, password});
            await getUser();
            navigate('/dashboard/app');
            return null;
        } catch (error) {
            const errorMessage = error.response.status === 422 ? 'Неверные учетные данные' : 'Произошла ошибка, попробуйте еще раз!';
            return errorMessage;
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }
    

    return <AuthContext.Provider value={{ user, getUser, login, logout, isInitialized }} >
        {children}
    </AuthContext.Provider>

};

export default function useAuthContext(){
    return useContext(AuthContext);
}