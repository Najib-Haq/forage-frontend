import { createContext, useContext, useState, useEffect} from "react";

const UserContext = createContext();

export function getStorageUser() {
    const username = localStorage.getItem('username')
    const userId = localStorage.getItem('userId')
    // console.log(value)
    if (userId === 'undefined') {
        // console.log("checking undef")
        return null
    }
    return [JSON.parse(userId), JSON.parse(username)];
}

export function setStorageUser(userId, username) {
    // console.log("Setting data: ", JSON.stringify(data))
    localStorage.setItem('userId', JSON.stringify(userId));
    localStorage.setItem('username', JSON.stringify(username));
    // setAuthToken(data);
}

export function removeStorageUser() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
}

export function useUser() {
    return useContext(UserContext);
}

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(getStorageUser());

  useEffect(() => {
    setStorageUser(user[0], user[1]);
  }, [user]);

  return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
