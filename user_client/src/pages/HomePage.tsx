import { Box, Button, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import Store, { AppDispatch, RootState } from "../Redux/Store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { addDesignCalendar, fetchDisignCalendar } from "../Redux/DesignCalendarSlice";
import { Calendar } from "../Models/Calendar";
import ShowDisignCalendar from "../componnents/ShowDesignCalendar";
import { useEffect, useRef, useState } from "react";
import LoginRegister, { styleModal } from "./LoginRegister";
import UpdateUser from "../componnents/UpdateUser";
import DesignScreen from "../componnents/DesignScreen";



const HomePage = () => {
    const Navigate = useNavigate();
    const [newCalendar, setNewCalendar] = useState(false);
    const TitleRef = useRef<HTMLInputElement>(null);
    const [Login, setLogin] = useState(false);
    const [_, setDesign] = useState(false);
    // sessionStorage.setItem("Design",`${true}`);

    const dispatch = useDispatch<AppDispatch>();

    const res = useSelector((state: RootState) => state.DesignCalendar.listDesignCalendar);
    const handleSubmit = () => {
        var DisignCalendar: Calendar = {
            id: res.length + 1,
            title: TitleRef.current?.value || `calendar ${res.length + 1}`,
            description: " ",
            pdfUrl: " "

        }
        // if (url) {
        dispatch(addDesignCalendar(DisignCalendar));
        Navigate(`/createCalendar`);
        sessionStorage.setItem("numOfCalendar", `${res.length + 1}`);

        // }
    }
    useEffect(() => {
        //  dispatch(fetchDisignCalendar());
        if (sessionStorage.getItem("Design") == 'true')
            dispatch(fetchDisignCalendar());
    }, [sessionStorage.getItem("Design"), res]);

    const SetDesign = () => {
        // setDesign(true);
        sessionStorage.setItem("Design", `${true}`);

        setLogin(false);
    }



    return (
        <>
            <div className="pageBox">

                <UpdateUser setDesign={setDesign} />
                <DesignScreen />
                <Modal open={newCalendar} onClose={() => { setNewCalendar(!newCalendar) }}>
                    <Box sx={styleModal}>
                        <TextField id="Title" type="text" label="Calendar Name"
                            variant="outlined" inputRef={TitleRef}
                            required fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
                        <Button type="submit" onClick={handleSubmit}>צור לוח שנה</Button>

                    </Box>
                </Modal>

                {/* <Button type="button" onClick={() => {
                setNewCalendar(true);
                
                }}>ליצירת לוח שנה חדש</Button> */}
                {sessionStorage.getItem("Design") == 'true' &&
                    <button className="design-button" onClick={() => {
                        setNewCalendar(true);
                    }}>
                        <span>צור עיצוב</span>
                    </button>
                }

                {sessionStorage.getItem("Design") == 'true' ? <>
                    

                        <Provider store={Store}>
                            <ShowDisignCalendar />
                        </Provider>
                    
                </>

                    :
                    <button className="design-button" type="button" onClick={() => { setLogin(true) }}>התחבר לאתר</button>
                }
                {Login && <LoginRegister status={false} setDesign={SetDesign} />}

                <footer>
                    <hr />
                    <p style={{ margin: "5px", padding: "10px" }}> ©  MomenTo - 2025 </p>
                </footer>
            </div>
        </>
    )
}

export default HomePage;

