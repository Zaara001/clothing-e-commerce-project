import { useEffect, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  useEffect(() => {
    document.body.classList.add("bg-gradient-to-r", "from-gray-900", "to-gray-100");
    return () => document.body.classList.remove("bg-gradient-to-r", "from-gray-900", "to-gray-100");
  }, []);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user);  // ✅ Update AuthContext state
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
          backgroundImage: "url('/your-logo.png')"
        }}></div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back!</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Provide your details to sign in</p>
          <form onSubmit={handleSubmit}>
            <input 
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm" 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              className="w-full px-4 py-2 mb-4 border rounded-lg text-sm" 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-600 text-sm">Forgot Password?</a>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">Sign In</button>
          </form>
          <div className="flex items-center justify-center mt-4">
            <span className="h-px w-full bg-gray-300"></span>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <span className="h-px w-full bg-gray-300"></span>
          </div>
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center border mt-4 py-2 rounded-lg hover:bg-gray-100">
            <FcGoogle className="text-2xl mr-2" /> Sign In with Google
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            New to Shop Name? <a href="#" className="text-blue-600" 
            onClick={(e) => {
                e.preventDefault(); // Prevents default anchor behavior
                navigate("/register");
            }}>Create an account.</a>
          </p>
        </div>
      </div>
    </div>
  );
}
