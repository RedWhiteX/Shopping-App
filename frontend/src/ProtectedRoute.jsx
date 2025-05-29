// import React,{useState,useEffect} from "react";
// import api from "./api";
// import {Navigate} from 'react-router-dom';
// import {jwtDecode} from 'jwt-decode';

// function ProtectedRoute({children}) {

//     const [IsAuthorized , setIsAuthorized] = useState(null)

//     useEffect(() => {
//         authorize().catch(() => setIsAuthorized(false))
//     },[])

//     const refreshToken = async () => {
//         const refresh = localStorage.getItem('refresh')
//         try{
//             const response = await api.post("api/token/refresh/",{refresh:refresh})
//             if (response.status === 200){
//                 localStorage.setItem("access",response.data.success)
//                 setIsAuthorized(true)
//             }else{
//                 setIsAuthorized(false)
//             }
//         }catch(error){
//             console.log(error)
//             setIsAuthorized(false)
//         }
//     }

//     const authorize = async () => {
//         const token = localStorage.getItem("access")
//         if(!token) {
//             setIsAuthorized(false)
//             return
//         }

//         const decoded = jwtDecode(token)
//         const Expire = decoded.exp
//         const now = Date.now() / 1000

//         if(Expire < now){
//             await refreshToken()
//         }else{
//             setIsAuthorized(true)
//         }
//     }
//     if(IsAuthorized === null) {
//         return <div>Loading...</div>
//     }
//     return IsAuthorized ? children : <Navigate to="/login" />
// }

// export default ProtectedRoute







import React, { useState, useEffect } from "react";
import api from "./api";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  
  useEffect(() => {
    authorize().catch(() => setIsAuthorized(false));
  }, []);
  
  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      setIsAuthorized(false);
      return;
    }
    
    try {
      const response = await api.post("api/token/refresh/", { refresh:refresh });
      
      // Make sure this matches your API response structure
      if (response.status === 200) {
        // Update this line based on your actual API response structure
        localStorage.setItem("access", response.data.access || response.data.success);
        setIsAuthorized(true);
      } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("username");
      setIsAuthorized(false);
    }
  };
  
  const authorize = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      const expire = decoded.exp;
      const now = Date.now() / 1000;
      
      // Add buffer time (30 seconds) to refresh earlier
      if (expire < now + 30) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setIsAuthorized(false);
    }
  };
  
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;