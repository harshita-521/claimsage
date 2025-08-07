import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import Spline from '@splinetool/react-spline';

function SignUp() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const signup = async (data) => {
        try {
            const response = await api.post('/user/register', {
                 fname: data.fname,
      lname: data.lname,
      userName: data.userName,
      email: data.email,
      password: data.password
            });
            console.log("Signup successful:", response.data);
            navigate('/login'); // redirect to login on success
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="signup-container">
            <div className="main">
                <div className="bg_spline">
                    <Spline scene="https://prod.spline.design/9bpGqvSTH0SW14lj/scene.splinecode" />
                </div>

                <div className="input_container">
                    <form onSubmit={handleSubmit(signup)} className="input_field">
                        <h1>Sign Up</h1>
<div>
                        <label>First Name: </label>
                        <input type="text" placeholder="First Name" {...register("fname")} />
                        {errors.fname && <p className="error">{errors.fname.message}</p>}
</div>
<div>
    <label>Last Name: </label>
                        <input type="text" placeholder="Last Name" {...register("lname")} />
                        {errors.lname && <p className="error">{errors.lname.message}</p>}
</div>
<div>
    <label>Username: </label>
                        <input type="text" placeholder="Username" {...register("userName")} />
                        {errors.userName && <p className="error">{errors.userName.message}</p>}
</div>
<div><label>Email Id: </label>
                        <input type="email" placeholder="Email" {...register("email")} />
                        {errors.email && <p className="error">{errors.email.message}</p>}
</div>
<div>
    <label>Password: </label>
                        <input type="password" placeholder="Password" {...register("password")} />
                        {errors.password && <p className="error">{errors.password.message}</p>}
</div>
                        <button type="submit">Sign Up</button>

                        {error && <p className="error">{error}</p>}

                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default SignUp;
