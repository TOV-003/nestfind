import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useMediaQuery } from 'react-responsive';
import { useState } from "react";

function Navbar() {
    const links = [
        { title: "Home", path: "/" },
        { title: "Listings", path: "/Listings" },
        { title: "Hosts", path: "/Search" }
    ];

    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [showOptions, setShowOptions] = useState(false);
    const { user } = useAuth();
    return (
        <header className="sticky top-0 z-10 bg-white">
            <nav className="flex items-center justify-between shadow-sm py-4 px-4">
                <div className="flex items-center justify-between gap-2">
                    <img src="/favicon.svg" alt="logo" className="w-8 h-8" />
                    <h1 className="text-primary hidden md:block">Nestfind</h1>
                </div>
                <div className="actions flex justify-between items-center gap-4 md:gap-8">
                    {links.map((el, index) => (<NavLink to={el.path} key={index} className={({ isActive }) => isActive ? "text-primary" : "text-gray-600"}>{el.title}</NavLink>))}
                </div>
                {
                    isMobile ?
                        <>
                            <div>
                                <button className="bg-primary aspect-square py-1 px-2 text-white font-bold rounded-lg cursor-pointer text-2xl" onClick={() => setShowOptions(!showOptions)}>☰</button>
                                {showOptions &&
                                    <div className="absolute top-15 right-4">
                                        <div className="flex flex-col justify-between items-end gap-4 md:gap-8 pr-8 pl-16 py-3 bg-white rounded-lg border-gray-300 border" >
                                            {
                                                user ?
                                                    <Link to="/Profile" className="text-lg text-black">Profile
                                                    </Link>

                                                    :
                                                    <>
                                                        <Link to="/Login" className="text-lg text-black">Log In
                                                        </Link>
                                                        <Link to="/Register" className="text-lg text-black">Sign Up
                                                        </Link>
                                                    </>}
                                        </div>
                                    </div>
                                }
                            </div>

                        </>
                        :
                        <>
                            <div className="flex items-center gap-4">
                                <div className="actions flex justify-between items-center gap-4 md:gap-8">
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
                        </>
                }

            </nav>
        </header>
    )
}

export default Navbar
