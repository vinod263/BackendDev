import { BrowserRouter, Routes, Route} from 'react-router';
import Login from './features/auth/pages/login';
import Register from './features/auth/pages/Register';
import Feed from './features/post/pages/feed'
export default function AppRoutes(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/" element={<Feed />}/>
        </Routes>
        </BrowserRouter>
    )
}