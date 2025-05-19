
import { router } from './Route';
import { RouterProvider } from 'react-router';


export const _http = "https://calendar-app-server-fn9y.onrender.com";

function App() {


  return (
    <>
        <RouterProvider router={router}>

        </RouterProvider>
        
    </>
  )
}

export default App
