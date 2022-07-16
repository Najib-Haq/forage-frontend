import { createContext, useContext, useState, useEffect} from "react";

const ProjContext = createContext();

export function getStorageProjID() {
    const value = localStorage.getItem('project')
    console.log(value)
    if (value === 'undefined') {
        // console.log("checking undef")
        return null
    }
    return JSON.parse(value);
}

export function setStorageProjID(data) {
    // console.log("Setting data: ", JSON.stringify(data))
    localStorage.setItem('project', JSON.stringify(data));
    // setAuthToken(data);
}

export function removeStorageProjID() {
    localStorage.removeItem('project');
}

export function useProjID() {
    return useContext(ProjContext);
}

export const ProjIDProvider = ({children}) => {
  const [projID, setProjID] = useState(getStorageProjID());

  useEffect(() => {
    setStorageProjID(projID);
  }, [projID]);

  return (
        <ProjContext.Provider value={{ projID, setProjID }}>
            {children}
        </ProjContext.Provider>
    );
}
