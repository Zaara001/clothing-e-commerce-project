import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    useEffect(() => {
        document.body.classList.add("bg-gradient-to-r", "from-gray-900", "to-gray-100");
        return () => document.body.classList.remove("bg-gradient-to-r", "from-gray-900", "to-gray-100");
    }, []);

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", { name, email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    const handleGoogleSignup = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
                    backgroundImage: "url('/your-logo.png')"
                }}></div>
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">CREATE AN ACCOUNT</h2>
                    <p className="text-sm text-gray-600 text-center mb-6">Provide your details.</p>
                    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                    <form onSubmit={handleRegister}>
                        <input className="w-full px-4 py-2 mb-4 border rounded-lg text-sm" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <input className="w-full px-4 py-2 mb-4 border rounded-lg text-sm" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input className="w-full px-4 py-2 mb-4 border rounded-lg text-sm" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Create An Account</button>
                    </form>
                    <div className="flex items-center justify-center mt-4">
                        <span className="h-px w-full bg-gray-300"></span>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <span className="h-px w-full bg-gray-300"></span>
                    </div>
                    <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center border mt-4 py-2 rounded-lg hover:bg-gray-100">
                        <FcGoogle className="text-2xl mr-2" /> Sign Up with Google
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Already a Member?
                        <a
                            href="#"
                            className="text-blue-600 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                            }}
                        >
                            Sign In.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
