import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
    const links = [
        { title: "Home", path: "/" },
        { title: "Listings", path: "/Listings" },
    ];


    const { user } = useAuth();
    return (
        <header>
            <nav className="flex items-center justify-between shadow-sm py-4 px-4">
                <div className="flex items-center justify-between gap-2">
                    <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
                    <h1 className="text-primary hidden md:block">Nestfind</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="actions flex justify-between items-center gap-8">
                        {links.map((el, index) => (<NavLink to={el.path} key={index} className={({ isActive }) => isActive ? "text-primary" : "text-gray-600"}>{el.title}</NavLink>))}
                    </div>
                </div>
                {
                    user ?
                        <div>
                            <Link to="/Profile">
                                <button className="bg-primary px-2 py-1 md:px-4 md:py-2 text-white rounded-lg cursor-pointer text-sm md:text-base">Profile</button>
                            </Link>
                        </div>

                        :
                        <div className="flex items-center gap-4">
                            <Link to="/Login">
                                <button className="bg-primary px-2 py-1 md:px-4 md:py-2 text-white rounded-lg cursor-pointer text-sm md:text-base">Log In</button>
                            </Link>
                            <Link to="/Register">
                                <button className="border  border-primary px-2 py-1 md:px-4 md:py-2 text-primary rounded-lg cursor-pointer text-sm md:text-base">Sign Up</button>
                            </Link>

                        </div>}
            </nav>
        </header>
    )
}

export default Navbar
