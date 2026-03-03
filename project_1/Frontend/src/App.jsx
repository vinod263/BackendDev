import { RouterProvider } from 'react-router'
import { router } from './AppRoutes'
import { AuthProvider } from './features/auth/auth.context'
import "./features/shared/global.scss"



const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={ router}/> 

    </AuthProvider>
  )
}

export default App