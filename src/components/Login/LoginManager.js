import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () =>{
    if(firebase.apps.length === 0){
      firebase.initializeApp(firebaseConfig);
    }
}

export const handleGoogleSignIn = () =>{
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)                //bujhinai why return ?
    .then(res => {
      const {displayName,email,photoURL} = res.user
      const signedInUser = {
        isLoggedIn : true,
        name : displayName ,
        email : email ,
        photo : photoURL ,
        success:true
      }     
      return signedInUser ;  // bujhinai why return ?
    })
  }

  export const handleFbSignin = () =>{
    const fbprovider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbprovider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      user.success = true
      return user
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }

  export const  createUserWithEmailAndPassword = (name,email,password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(res =>{
        const newUserInfo = res.user
        newUserInfo.error = ''
        newUserInfo.success = true      
        updateUserName(name)
        return newUserInfo
      }) 
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {}
        newUserInfo.error = error.message
        newUserInfo.success = false
        return newUserInfo
      });
  }

  export const signInWithEmailAndPassword= (email,password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res =>{
        const newUserInfo = res.user;
        newUserInfo.error = ''
        newUserInfo.success = true 
        return newUserInfo
      })
      .catch(function(error) {
       const newUserInfo = {}
       newUserInfo.error = error.message
       newUserInfo.success = false
       return newUserInfo
      });
  }

  export const updateUserName = name =>{
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name      
    }).then(function() {
      console.log('User name update successfully');
    }).catch(function(error) {
      console.log(error);
    });
  }

  export const signOutHandeler = () =>{
    return firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isLoggedIn : false,
        name : '' ,
        email : '' ,
        photo : '' ,
        
      }
      return signOutUser
    })
    .catch(e => console.log(e))       
  }