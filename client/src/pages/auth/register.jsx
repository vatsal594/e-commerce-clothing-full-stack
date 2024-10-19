import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";

// Initial state for form inputs
const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    const errors = {};

    // Username validation
    if (!formData.userName.trim()) {
      errors.userName = "Username is required.";
    }

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    return errors;
  };

  // Form submission handler
  function onSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // No validation errors, proceed with form submission
      dispatch(registerUser(formData)).then((data) => {
        if (data?.payload?.success) {
          // Show success toast
          toast.success(data?.payload?.message || "Account created successfully!");
          navigate("/auth/login");
        } else {
          // Show error toast
          toast.error(data?.payload?.message || "Failed to create account.");
        }
      });
    } else {
      // Show validation error messages as a toast notification
      Object.values(validationErrors).forEach((error) => toast.error(error));
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={errors} // Passing errors to the form for display
      />
      {errors.userName && <p className="text-red-500">{errors.userName}</p>}
      {errors.email && <p className="text-red-500">{errors.email}</p>}
      {errors.password && <p className="text-red-500">{errors.password}</p>}

      {/* Toastify container for displaying notifications */}
      <ToastContainer />
    </div>
  );
}

export default AuthRegister;
