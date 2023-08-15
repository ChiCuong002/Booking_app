import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null)
    const { ready, user, setUser } = useContext(UserContext);
    let { subpages } = useParams();
    if (subpages === undefined) {
        subpages = 'profile';
    }
    async function logOut() {
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }
    console.log(subpages)
    if (!ready) {
        return 'Loading...'
    }
    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }
    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <AccountNav />
            {subpages === 'profile' && (
                <div className="text-center max-w-lg mx-auto ">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logOut} className="primary max-w-sm mt-2" >Logout</button>
                </div>
            )}
            {subpages === 'places' && (
                <PlacesPage />
            )}
        </div>
    )
}