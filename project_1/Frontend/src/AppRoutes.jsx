import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/feed";
export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Feed/>
    }
])


// import { BrowserRouter, Routes, Route} from 'react-router';
// import Login from './features/auth/pages/Login';
// import Register from './features/auth/pages/Register';
// import Feed from './features/post/pages/feed'
// export default function AppRoutes(){
//     return (
//         <BrowserRouter>
//         <Routes>
//             <Route path="/" element={<h1>Welcome to the app</h1>}/>
//             <Route path="/login" element={<Login />}/>
//             <Route path="/register" element={<Register />}/>
//             <Route path="/home" element={<Feed />}/>
//         </Routes>
//         </BrowserRouter>
//     )
// }