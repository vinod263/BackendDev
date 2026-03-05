import { RouterProvider } from 'react-router'
import { router } from './AppRoutes'
import { AuthProvider } from './features/auth/auth.context'
import "./features/shared/global.scss"
import "./features/shared/button.scss"
import { PostContextProvider } from './features/post/posts.context'



const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
      <RouterProvider router={ router}/> 
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App