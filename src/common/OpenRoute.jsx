import { useContext } from "react"
import { UserData } from "../context/Context"
import { Navigate } from "react-router-dom";

function OpenRoute({children}) {

    const {token} = useContext(UserData);

    if(token === null){
        return children
    }
    else{
        <Navigate to={'/'}/>
    }
}

export default OpenRoute