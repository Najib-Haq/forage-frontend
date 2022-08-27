import { createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export function getStorageToken() {
    const value = localStorage.getItem('token')
    console.log(value)
    if (value === 'undefined') {
        // console.log("checking undef")
        return null
    }
    return JSON.parse(value);
}

export function getUserID() {
    const value = localStorage.getItem('userId')
    console.log(value)
    if (value === 'undefined') {
        // console.log("checking undef")
        return null
    }
    return JSON.parse(value);
}

export function setStorageToken(data) {
    // console.log("Setting data: ", JSON.stringify(data))
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

  useEffect(() => {
    setStorageToken(authToken);
  }, [authToken]);

  return (
        <AuthContext.Provider value={{ authToken, setAuthToken }}>
            {authToken ? opt1 : opt2}
        </AuthContext.Provider>
    );
}
