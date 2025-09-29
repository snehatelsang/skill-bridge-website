import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp(){
  const navigate = useNavigate();
  const [form,setForm] = useState({ name:"", email:"", password:"", role:"STUDENT", subject:"", rate:"", location:"", description:"" });

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/signup", form);
      // res.data === { id, name, role }
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      // redirect based on role
      if (res.data.role === "TUTOR") navigate("/tutor-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create account</h2>
        <form onSubmit={submit} className="signup-form">
          <input name="name" value={form.name} onChange={onChange} placeholder="Full name" required />
          <input name="email" value={form.email} onChange={onChange} placeholder="Email" required />
          <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" required />
          <select name="role" value={form.role} onChange={onChange}>
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
          {form.role === "TUTOR" && (
            <>
              <input name="subject" value={form.subject} onChange={onChange} placeholder="Subject" />
              <input name="rate" value={form.rate} onChange={onChange} placeholder="Rate (number)" type="number" />
              <input name="location" value={form.location} onChange={onChange} placeholder="Location" />
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Short description" />
            </>
          )}
          <button type="submit">Sign up</button>
        </form>
        <p>Already have an account? <a href="/signin">Sign in</a></p>
      </div>
    </div>
  );
}
