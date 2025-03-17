import { createBrowserRouter, Navigate } from "react-router";
import LoginRegister from "./pages/LoginRegister";
import HomePage from "./componnents/HomePage";
import ShowTemplates from "./componnents/ShowTemplates";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />, // ברירת מחדל: ניתוב לעמוד ההתחברות
      },
      {
        path: "/login",
        element: <LoginRegister />,
      },
      {
        path: "/homePage",
        element: <HomePage />,
        children: [
            
        ]
    },
    {
        path: "/templates",
        element: <ShowTemplates />,
      },
    
])