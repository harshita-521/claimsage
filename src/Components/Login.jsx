
import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { useForm } from "react-hook-form";
import './Login.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import api from '../api';


import { useDispatch } from 'react-redux';
import { setchatUserName } from '../store/slices/chatSlice';
import {setUserName, setUserId, setEmail }from '../store/slices/userSlice';
function Login() {

  const dispatch = useDispatch() ; 

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const login = async (data) => {
  try {
    const response = await api.post('/user/login', {
       userName: data.userName,
  password: data.password
    }); 

    console.log("Login successful:", response.data);
    dispatch(setUserName(data.userName));
    dispatch(setUserId(response.data.userId));
    dispatch(setEmail(response.data.email));
    dispatch(setchatUserName(data.userName));
    navigate('/chat'); 

  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Login failed");
  }
};



  return (
    <div className="main">
      <div className="bg_spline">
        <Spline scene="https://prod.spline.design/9bpGqvSTH0SW14lj/scene.splinecode" />
      </div>
      <div className="input_container">

        <form onSubmit={handleSubmit(login)}>
          <div className="input_field">
            <h1>Login</h1>
            <div>
              <label>Username: </label>
              <input
                type='text'
                placeholder='Enter your username'
                {...register("userName", {
                  required: true,
                  minLength: 3
                })}
              />

            </div>
            <div>
              <label>Password: </label>
              <input
                type='password'
                placeholder='Enter your password'
                {...register("password", {
                  required: true
                })}
              />
            </div>

            <button type='submit'>
              Login
            </button>

          </div>
        </form>
        {error && <p className="error">{error}</p>}

        <p>Dont have an account? <NavLink
          to="/signUp">
          SignUp</NavLink> </p>

      </div>


    </div>
  )
}

export default Login

