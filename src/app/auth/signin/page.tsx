// 'use client'

// import { FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import './signin.css'
// export default function Login() {
//     const router = useRouter()

//     // Boilerplate code from https://nextjs.org/docs/pages/building-your-application/authentication
//     async function handleSubmit(event: FormEvent<HTMLFormElement>) {
//         event.preventDefault()

//         const formData = new FormData(event.currentTarget)
//         const username = formData.get('username')
//         const password = formData.get('password')

//         const response = await fetch('/api/auth/login', {
//             method: 'POST',
//             headers: { 'ContentType': 'application/json' },
//             body: JSON.stringify({ username, password }),
//         })

//         if (response.ok) {
//             // router.push(*INSERT PAGE HERE*)
//         } else {
//             // Retry Login
//         }
//     }

//     return (
//         <main>
//             <div className="main">
//                 <div className="top-bar-container">
//                     <img src="" alt="Logo" id="logo" />
//                     <div className="about-us">
//                         <a href="">About us</a>
//                     </div>
//                 </div>
//                 <div className="login-center-container">
//                     <div className="login-form-container">
//                         <h1>Log In</h1>
//                         <form className="login-form" onSubmit={handleSubmit}>
//                             <div className="username-form">
//                                 <input id="login-username" name="username" type="username" placeholder="Username" required />
//                             </div>
//                             <div className="password-form">
//                                 <input id="login-password" name="password" type="password" placeholder="Password" required />
//                             </div>
//                         </form>
//                         <h3><a href="" id="forgot-password">Forgot Password?</a></h3>
//                         <button type="submit" id="login-button">Log in</button>
//                     </div>
//                     <div className="create-account-container">
//                         <h3 id="new-to-unionizer">New to Unionizer? <a href="" id="join-now">Join now</a></h3>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// } 