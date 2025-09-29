import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignIn(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/signin", { email, password });
      // res.data === { id, name, role }
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      if (res.data.role === "TUTOR") navigate("/tutor-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Signin failed");
      console.error(err);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2>Sign in</h2>
        <form onSubmit={submit} className="signin-form">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
          <button type="submit">Sign in</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
