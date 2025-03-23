import { createBrowserRouter, Navigate } from "react-router";
import LoginRegister from "./pages/LoginRegister";
import HomePage from "./pages/HomePage";
// import ShowTemplates from "./componnents/ShowTemplates";
import CreateCalendarScreen from "./pages/CreateCalendarScreen";





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
        path: "/createCalendar",
        element: <CreateCalendarScreen />,
        // children:[
        //   {
        //     path: "templates",
        //     element: <ShowTemplates/>,
        //   },
        // ]
      },
    
])