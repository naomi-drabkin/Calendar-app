import { createBrowserRouter, Navigate } from "react-router";
import LoginRegister from "./pages/LoginRegister";
import HomePage from "./pages/HomePage";
// import ShowTemplates from "./componnents/ShowTemplates";
import CreateCalendarScreen from "./pages/CreateCalendarScreen";
import { Provider } from "react-redux";
import Store from "./Redux/Store";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/homePage" replace />, 
      },
      {
        path: "/login",
        element: <LoginRegister status={true}  setDesign={()=>{}}/>,
      },
      {
        path: "/homePage",
        element:<Provider store={Store}> <HomePage /></Provider>,
        // children: [
            
        // ]
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