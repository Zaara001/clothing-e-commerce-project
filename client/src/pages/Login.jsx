import { useEffect, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios"; // Import axios
import logo from "../assets/images/logo_img.png";

export default function Login() {
  useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #8A6F5A, #BBA190, #E0C8B0)";
  
    return () => {
      document.body.style.background = "";
    };
  }, []);
  

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
  
    try {
      console.log("Attempting login with:", { email, password });
  
      const res = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true }
      );
  
      console.log("Full Login Response:", res.data);
  
      if (res.data?.user) {
        login(res.data.user); // ✅ Ensure AuthContext updates
        navigate("/"); // ✅ Redirect after login
      } else {
        throw new Error(res.data?.message || "Login failed"); // Handle missing user data
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.response?.data?.message || err.message || "Login failed"); // More reliable error handling
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      window.open("http://localhost:3000/auth/google", "_self");
  
      const response = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });
  
      if (response.data?.user) {
        console.log("Google Login User:", response.data.user);
        login(response.data.user); // ✅ Set the user in AuthContext
        navigate("/"); // ✅ Redirect to home or dashboard
      } else {
        console.error("Failed to fetch user data after Google login");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
          backgroundImage: `url(${logo})`
        }}></div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back!</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Provide your details to sign in</p>

          {/* Display error message if there is one */}
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

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