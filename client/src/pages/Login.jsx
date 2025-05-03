import { useEffect, useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import logo from "../assets/images/logo_img.png";

export default function Login() {
  useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #8A6F5A, #BBA190, #E0C8B0)";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));

      if (location.state?.cartAction) {
        dispatch(addItemToCart({ _id: location.state.productId }));
        navigate("/cart");
      } else {
        const from = location.state?.from || "/";
        navigate(from);
      }
    }
  }, [user, dispatch, navigate, location]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = await login(email, password);
        if (!userData) throw new Error("User data not available");

        dispatch(setUser({
          name: userData.name,
          email: userData.email,
          _id: userData._id
        }));
      }
    } catch (err) {
      console.error("Login error:", err);
      setSubmitError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
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
          <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome Back!</h2>
          <p className="text-sm text-gray-600 text-center mb-6">Provide your details to sign in</p>

          {submitError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-600 text-sm">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center justify-center mt-4">
            <span className="h-px w-full bg-gray-300"></span>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <span className="h-px w-full bg-gray-300"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border mt-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-2xl mr-2" /> Sign In with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            New to Shop Name?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Create an account.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}