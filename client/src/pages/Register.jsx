import { useEffect, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logo_img.png";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login, getUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #8A6F5A, #BBA190, #E0C8B0)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    if (isRegistered) {
      navigate("/");
    }
  }, [isRegistered, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const userData = await getUser();
      if (!userData) {
        throw new Error("User data not available after registration");
      }

      dispatch(setUser(userData));
      setIsRegistered(true);

    } catch (err) {
      console.error("Registration error:", err);
      setSubmitError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          className="hidden md:block md:w-1/2 bg-cover bg-center" 
          style={{ backgroundImage: `url(${logo})` }}
        ></div>
        
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">CREATE AN ACCOUNT</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Provide your details.</p>
          
          {submitError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <input 
                className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.name ? "border-red-500" : ""}`} 
                type="text" 
                placeholder="Your Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <input 
                className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.email ? "border-red-500" : ""}`} 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <input 
                className={`w-full px-4 py-2 border rounded-lg text-sm ${errors.password ? "border-red-500" : ""}`} 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create An Account"}
            </button>
          </form>

          <div className="flex items-center justify-center mt-4">
            <span className="h-px w-full bg-gray-300"></span>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <span className="h-px w-full bg-gray-300"></span>
          </div>

          <button 
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center border mt-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-2xl mr-2" /> Sign Up with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already a Member?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline cursor-pointer"
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