
"use client"

import { Box, Button, Modal, TextField } from "@mui/material"
import { useNavigate } from "react-router"
import Store, { type AppDispatch, type RootState } from "../Redux/Store"
import { Provider, useDispatch, useSelector } from "react-redux"
import { addDesignCalendar, fetchDisignCalendar } from "../Redux/DesignCalendarSlice"
import type { Calendar } from "../Models/Calendar"
import { useEffect, useRef, useState } from "react"
import LoginRegister from "./LoginRegister"
import UpdateUser from "../componnents/UpdateUser"
import DesignScreen from "../componnents/DesignScreen"
import ShowDisignCalendar from "../componnents/ShowDesignCalendar"

const calendarModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  p: 4,
  borderRadius: "12px",
  outline: "none",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(8px)",
}

const HomePage = () => {
  const Navigate = useNavigate()
  const [newCalendar, setNewCalendar] = useState(false)
  const TitleRef = useRef<HTMLInputElement>(null)
  const [Login, setLogin] = useState(false)
  const [_, setDesign] = useState(false)
  // sessionStorage.setItem("Design",`${true}`);

  const dispatch = useDispatch<AppDispatch>()

  const res = useSelector((state: RootState) => state.DesignCalendar.listDesignCalendar)
  const handleSubmit = () => {
    console.log(res.length + 1)

    var DisignCalendar: Partial<Calendar> = {   
      title: TitleRef.current?.value || `calendar ${res.length + 1}`,
      description: " ",
      pdfUrl: " ",
      numOfCalendar: res.length + 1,
    }
    // if (url) {
    dispatch(addDesignCalendar(DisignCalendar))
    Navigate(`/createCalendar`)
    sessionStorage.setItem("numOfCalendar", `${res.length + 1}`)

    // }
  }
  useEffect(() => {
    //  dispatch(fetchDisignCalendar());
    if (sessionStorage.getItem("Design") == "true") dispatch(fetchDisignCalendar())
  }, [sessionStorage.getItem("Design"), res])

  const SetDesign = () => {
    // setDesign(true);
    sessionStorage.setItem("Design", `${true}`)

    setLogin(false)
  }

  // סגנונות לרכיבים
  const textFieldStyle = {
    marginBottom: "16px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "&:hover fieldset": {
        borderColor: "#8a2be2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#8a2be2",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "#8a2be2",
      },
    },
    bgcolor: "rgb(249, 249, 249)",
  }

  const buttonStyle = {
    marginTop: "16px",
    borderRadius: "8px",
    padding: "10px 16px",
    textTransform: "none",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #00c6ff 0%, #8a2be2 100%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(90deg, #00b4e6 0%, #7a1bd2 100%)",
      boxShadow: "0 4px 12px rgba(138, 43, 226, 0.3)",
    },
  }

  return (
    <>
      <div className="pageBox">
        <UpdateUser setDesign={setDesign} />
        <DesignScreen />
        <Modal
          open={newCalendar}
          onClose={() => {
            setNewCalendar(!newCalendar)
          }}
        >
          <Box sx={calendarModalStyle}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h2
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "24px",
                  background: "linear-gradient(90deg, #00c6ff 0%, #8a2be2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                MomenTo
              </h2>
              <p
                style={{
                  margin: "0",
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                צור לוח שנה חדש
              </p>
            </div>

            <div dir="rtl">
              <TextField
                id="Title"
                type="text"
                label="שם לוח השנה"
                variant="outlined"
                inputRef={TitleRef}
                required
                fullWidth
                sx={textFieldStyle}
              />
              <Button type="submit" onClick={handleSubmit} fullWidth sx={buttonStyle}>
                צור לוח שנה
              </Button>
            </div>
          </Box>
        </Modal>

    
        {sessionStorage.getItem("Design") == "true" && (
          <button
            className="design-button"
            onClick={() => {
              setNewCalendar(true)
            }}
          >
            <span>צור עיצוב</span>
          </button>
        )}

        {sessionStorage.getItem("Design") == "true" ? (
          <>
            <Provider store={Store}>
              <ShowDisignCalendar />
            </Provider>
          </>
        ) : (
          <button
            className="design-button"
            type="button"
            onClick={() => {
              setLogin(true)
            }}
          >
            התחבר לאתר
          </button>
        )}
        {Login && <LoginRegister status={false} setDesign={SetDesign} />}

        <footer>
          <hr />
          <p style={{ margin: "5px", padding: "10px" }}> © MomenTo - 2025 </p>
        </footer>
      </div>
    </>
  )
}

export default HomePage
