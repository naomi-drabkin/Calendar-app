import { Button } from "@mui/material";
import UpdateUser, { token } from "../componnents/UpdateUser";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
// import { numOfCalendar } from "../Redux/DesignCalendarSlice";



const HomePage = () => {
    // const [ShowTemplate, setShowTemplates] = useState(false);
    const Navigate = useNavigate();
    const [newUser, setNewUser] = useState(true);

    // const checkNewUser = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:5204/api/Image/all", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (response.data.length > 0)
    //             setNewUser(false);
    //     } catch {
    //         alert("יש בעיות בטעינת הפורפיל שלך - נא סגור את האפליקצייה וכנס שנית")
    //     }

    // }

    useEffect(() => {
        // checkNewUser();
    }, []);
    
    const url = "C:/Users/USER/Pictures/פרויקטים שנה ב/פרקטיקום לוח שנה/user_client/src/assets/1Q3A9348ג.jpg";

    return (
        <>
            {/* <ImageUpload /> */}
            <UpdateUser />
            {/* <Provider store={Store}>
                <ShowDisignCalendar />
            </Provider> */}
            {/* <CreateCalendarScreen/> */}
            {/* {!newUser &&
                <Button type="button" onClick={() => url && Navigate(`/createCalendar`)}>להמשך יצירת לוח השנה האחרון</Button>
            } */}
            <Button type="button" onClick={() => { 
                if (url) {
                    Navigate(`/createCalendar`);
                    const countCalendar = sessionStorage.getItem("countCalendar") || "0";
                    sessionStorage.setItem('numOfCalendar', (parseInt(countCalendar) + 1).toString());
                }
            }}>ליצירת לוח שנה חדש</Button>
            {/*פה צריך להציג את כל לוחות המוכנים שכבר קיימים - כלומר להכין כפתור שמירה*/}
            <Button type="button"onClick={() => { 
                if (url) {
                    Navigate(`/createCalendar`),
                    sessionStorage.setItem("numOfCalendar","0");
                }}}>השמך לוח שנה
             </Button>


        </>
    )
}

export default HomePage;
