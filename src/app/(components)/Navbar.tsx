import Link from "next/link"
import Logout from "./Logout"

export default function Navbar(){
    return(
        <div>
            <nav className="bg-gray-800 p-4 flex justify-between items-center">
                <div className="text-white text-lg font-bold">ShareAway</div>
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/" className="text-white hover:text-gray-400">Home</Link>
                        </li>
                    <li>
                        <Link href="/admin" className="text-white hover:text-gray-400">Admin</Link>
                    </li>
                    <li>
                        <Link href="/profile" className="text-white hover:text-gray-400">Profile</Link>
                    </li>
                    <li>
                        <Link href="/login" className="text-white hover:text-gray-400">Login</Link>
                    </li>
                    <li>
                        <Link href="/sign-up" className="text-white hover:text-gray-400">Register</Link>
                    </li>
                    <li>
                        <Logout/>
                    </li>
                </ul>
            </nav>
        </div>
    )
}