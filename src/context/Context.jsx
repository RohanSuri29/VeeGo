import { createContext, useState } from "react"

export const UserData = createContext();

function Context({children}) {

    const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {});
    const [token , setToken] = useState(localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null);
    const [image , setImage] = useState("");
    const [captain , setCaptain] = useState(localStorage.getItem("captain") ? JSON.parse(localStorage.getItem("captain")) : {})
    const [ride , setRide] = useState("");
    const value = {user , setUser , token , setToken , image , setImage , captain , setCaptain , ride , setRide};

    return (

        <div>
            <UserData.Provider value={value}>
                {children}
            </UserData.Provider>
        </div>
    )
}

export default Context