import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/Store';
import { fetchDisignCalendar } from '../Redux/DesignCalendarSlice';
import { useNavigate } from 'react-router';
import { AiOutlineCalendar } from "react-icons/ai";  // Ant Design - מודרני ושטוח
import { token } from './UpdateUser';


export default function ShowDisignCalendar() {
    const dispatch = useDispatch<AppDispatch>();
    
    const listCalendars = useSelector((state: RootState) => state.DesignCalendar.listDesignCalendar)
    const Navigate = useNavigate();
    // useEffect(() => {

    //     dispatch(fetchDisignCalendar());
    // }, [listCalendars]);

        
    useEffect(() => {
        if (!token) return; // מחכה עד שהטוקן קיים
        dispatch(fetchDisignCalendar());
    }, []); //


    useEffect(() => {
        
    }, [listCalendars]);


    return (
        <>

            <p style={{fontSize:"15px",fontWeight:"normal",position:"absolute",top:"63%",justifyContent:"center"}}>עיצובים אחרונים</p>
            <div className="calendarDesign-container">
                {listCalendars.length > 0 ? (
                    listCalendars.map((img, index) => (
                        // console.log(img),
                        <button className="calendarDesign-box" type='button' onClick={() => { sessionStorage.setItem("numOfCalendar", `${img.id}`); Navigate(`/createCalendar`) }}>
                            <span className="calendarDesign-icon" ><AiOutlineCalendar/></span>
                            <p key={index}>{img.title}</p>
                        </button>
                    ))
                ) : (
                    <p></p>
                )}
            </div>
        </>
    )
}


// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../Redux/Store";
// import { fetchDisignCalendar } from "../Redux/DesignCalendarSlice";
// import { useNavigate } from "react-router";
// import { Grid, IconButton, Typography, Box } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// export default function ShowDisignCalendar() {
//     const dispatch = useDispatch<AppDispatch>();
//     const listCalendars = useSelector((state: RootState) => state.DesignCalendar.listDesignCalendar);
//     const navigate = useNavigate();

//     useEffect(() => {
//         dispatch(fetchDisignCalendar());
//     }, [dispatch]);

//     return (
        
//         <Box sx={{ padding: 4 }}>
//             <Typography variant="h5" align="center" gutterBottom sx={{color:"#2bfea2"}}>
//                 עיצובים קודמים
//             </Typography>
//             {listCalendars.length > 0 ? (
//                 <Grid container spacing={2} justifyContent="center">
//                     {listCalendars.map((calendar) => (
//                         <Grid item key={calendar.id}>
//                             <IconButton
//                                 onClick={() => {
//                                     sessionStorage.setItem("numOfCalendar", `${calendar.id}`);
//                                     navigate("/createCalendar");
//                                 }}
//                                 sx={{
//                                     width: 120,
//                                     height: 120,
//                                     borderRadius: 2,
//                                     backgroundColor: "#f5f5f5",
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     boxShadow: 3,
//                                     transition: "0.3s",
//                                     '&:hover': { backgroundColor: "#e0e0e0" }
//                                 }}
//                             >
//                                 <CalendarMonthIcon sx={{ fontSize: 50, color: "#e99071" }} />
//                                 <Typography variant="body2" sx={{ marginTop: 1 }}>{calendar.title}</Typography>
//                             </IconButton>
//                         </Grid>
//                     ))}
//                 </Grid>
//             ) : (
//                 <Typography align="center" color="textSecondary">
//                     צור לוחות שנה בהתאמה אישית
//                 </Typography>
//             )}
//         </Box>
//     );
// }
