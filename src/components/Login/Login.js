import React, { useState } from 'react';

import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOutHandeler, handleFbSignin, handleGoogleSignIn, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';

initializeLoginFramework()
function Login() {
  const [loggedInUser,setLoggedInUser] = useContext(UserContext)
  
  let history = useHistory();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  
  const [newUser, setNewUser] = useState(false)
  const [user,setUser] = useState({
    isLoggedIn : false,
    name : '' ,
    email : '' ,
    password : '' ,
    photo : '' ,
    error : '' ,  
    success : false
  })

  const handelBlur = (e) =>{
    let isFieldValid = true 
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
      
    }
    if(e.target.name === 'password'){
      const passwordLength = e.target.value.length > 6
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = passwordHasNumber && passwordLength
    }

    if(isFieldValid){
      const newUserInfo = {...user}
      //const newUserInfos = user    //problem
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }
  }

  const submitHandeler = (e) =>{
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name ,user.email , user.password)
      .then(res =>{
        handelResponse(res,true)
      })
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email , user.password)
      .then(res =>{
        handelResponse(res,true)
      })
    }
    e.preventDefault()
  }

const googleSignIn = ()=> {
  handleGoogleSignIn()  //as it return a promise
  .then(res => {
    handelResponse(res,true)
  })
}
const fbSignin = () => {
  handleFbSignin()
  .then(res =>{
    handelResponse(res,true)
  })
}
const signOut = () => {
  signOutHandeler()
  .then(res =>{
    handelResponse(res,false)
  })
}
  const handelResponse = (res,redirect) =>{
    setUser(res)
    setLoggedInUser(res)
    if(redirect){
      history.replace(from)
    }
  }

  return (
    <div style={{textAlign:"center"}}>
      {
        user.isLoggedIn ? <button onClick={signOut}>Sign Out</button>
                        :  <button onClick={googleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={fbSignin}>Login with facebook</button>
      {
        user.isLoggedIn && <div>
          <p>Welcome, {user.name}</p>       
          <p>Email : {user.email}</p>
          <img src={user.photo}></img>
        </div>
      }
      <h1>Our own Authentication</h1>
      
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""></input>
      <label htmlFor="newUser">New User SignIn</label>
      <form onSubmit = {submitHandeler}>
        {newUser && <input name="name" type="text" onBlur={handelBlur} placeholder="Enter Name"></input>}<br/>
        <input type="email" required name="email" onBlur={handelBlur} placeholder="Enter email" ></input> <br/>
        <input type="password" name="password" onBlur={handelBlur} placeholder="Enter password"></input> <br/>
        <input type="submit" value={newUser ? 'Signup' : 'SignIn'} onClick={submitHandeler} ></input>
      </form>
    <p style={{color: 'red'}}>{user.error}</p>
    {user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged in'} Successfully</p>}
    </div>
  );
}

export default Login;
