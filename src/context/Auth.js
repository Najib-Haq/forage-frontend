import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function getStorageToken() {
    return JSON.parse(localStorage.getItem('token'));
}

export function setStorageToken(data) {
    localStorage.setItem('token', JSON.stringify(data));
    // setAuthToken(data);
}

export function removeStorageToken() {
    localStorage.removeItem('token');
}

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ opt1, opt2 }) => {
  const [authToken, setAuthToken] = useState(getStorageToken());

  return (
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {/* {authToken ? opt1 : opt2} */}
            {opt1}
        </AuthContext.Provider>
    );
}
