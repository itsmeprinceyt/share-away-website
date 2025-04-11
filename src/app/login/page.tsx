import Link from "next/link"

export default function Login() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">

            <div className="bg-blue-500 flex flex-col justify-center items-center p-4 rounded-lg shadow-lg w-1/3">
                <label>Username</label>
                <input
                    type="text"
                    className="bg-white text-black p-2 rounded-lg mb-4 w-full"
                />
                <label>Password</label>
                <input
                    type="password"
                    className="bg-white text-black p-2 rounded-lg mb-4 w-full"
                />
            </div>
            <button className="bg-blue-500 text-white p-2 rounded-lg mt-4 w-[150px]">
                Login
            </button>
            <Link
                href="/sign-up"
            >
                <button className="bg-purple-500 text-white p-2 rounded-lg mt-4 w-[150px]">
                    Sign Up
                </button>
            </Link>
        </div>
    )
}