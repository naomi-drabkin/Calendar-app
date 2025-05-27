
"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Box, Button, Modal, TextField } from "@mui/material"
import HomePage from "./HomePage"
import { useNavigate } from "react-router"
import { _http } from "../App"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const styleModal = {
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

export const textFieldStyle = {
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


const LoginRegister = ({ status, setDesign }: { status: boolean; setDesign: Function }) => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const UserNameRef = useRef<HTMLInputElement>(null)
  const UserFamilyRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  const MySwal = withReactContent(Swal);

  const [isRegister, setIsRegister] = useState(status)
  const [isOpenModal, setIsOpenModal] = useState(true)
  const [openNextComponnent, setOpenNextComponnent] = useState(false)
  const [loading, setLoading] = useState(false)
  // const handleSubmit = async (event: FormEvent) => {
  //   event.preventDefault()
  //   let res = null
  //   try {
  //     if (!isRegister) {
  //       res = await axios.post(`${_http}/api/User/login`, {
  //         email: emailRef.current?.value,
  //         password: passwordRef.current?.value,
  //       })
  //       console.log("login")
  //     } else {
  //       res = await axios.post(`${_http}/api/User/register`, {
  //         email: emailRef.current?.value,
  //         password: passwordRef.current?.value,
  //         UserName: UserNameRef.current?.value,
  //         UserFamily: UserFamilyRef.current?.value,
  //         Role: "User",
  //       })
  //       console.log("register")
  //     }
      
  //     await sessionStorage.setItem("AuthToken", res.data.token)
  //     sessionStorage.setItem("countCalendar", res.data.countCalendar)
  //     await setOpenNextComponnent(true)
  //     setIsOpenModal(false)
  //     setDesign()
  //     status == true ? navigate("/homePage") : setOpenNextComponnent(false)
  //   } catch (error) {
  //     alert("ארע תקלה בהתחברות")
  //   }
  // }


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    let res = null;

    try {
      if (!isRegister) {
        res = await axios.post(`${_http}/api/User/login`, {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
        });
        console.log("login");
      } else {
        res = await axios.post(`${_http}/api/User/register`, {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
          UserName: UserNameRef.current?.value,
          UserFamily: UserFamilyRef.current?.value,
          Role: "User",
        });
        console.log("register");
      }

      sessionStorage.setItem("AuthToken", res.data.token);
      sessionStorage.setItem("countCalendar", res.data.countCalendar);

      setOpenNextComponnent(true);
      setIsOpenModal(false);
      setDesign();
      if (status) navigate("/homePage");
      else setOpenNextComponnent(false);

      await MySwal.fire({
        icon: 'success',
        title: isRegister ? 'נרשמת בהצלחה!' : 'התחברת בהצלחה!',
        confirmButtonText: 'אישור',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error(error);
      setIsOpenModal(false);
      setOpenNextComponnent(false);
      await MySwal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'ארעה תקלה - נסה שנית',
        confirmButtonColor: '#d33',
        confirmButtonText: 'סגור',
      });
    } finally {
      setLoading(false);
    }
  };


 
  useEffect(() => {}, [sessionStorage.getItem("AuthToken")])


  const buttonStyle = {
    marginTop: "8px",
    marginBottom: "8px",
    borderRadius: "8px",
    padding: "10px 16px",
    textTransform: "none",
    fontWeight: "bold",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #00c6ff 0%, #8a2be2 100%)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(90deg, #00b4e6 0%, #7a1bd2 100%)",
      boxShadow: "0 4px 12px rgba(138, 43, 226, 0.3)",
    },
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    color: "#8a2be2",
    "&:hover": {
      backgroundColor: "rgba(138, 43, 226, 0.08)",
    },
  }

  return (
    <>


      {!openNextComponnent ? (
        <>
          <Modal
            onClose={() => {
              setIsOpenModal(false)
              setIsRegister(false)
            }}
            open={isOpenModal}
          >
            <Box sx={styleModal}>
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
                  {isRegister ? "צור חשבון חדש" : "התחבר לחשבון שלך"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} dir="rtl">
              <TextField
                  id="email"
                  type="email"
                  label="אימייל"
                  variant="outlined"
                  inputRef={emailRef}
                  required
                  fullWidth
                  sx={textFieldStyle}
                />

                <TextField
                  id="password"
                  type="password"
                  label="סיסמה"
                  variant="outlined"
                  inputRef={passwordRef}
                  required
                  fullWidth
                  sx={textFieldStyle}
                  />
                  
                  {isRegister && (
                  <>
                  <TextField
                  id="UserName"
                  type="text"
                  label="שם פרטי"
                  variant="outlined"
                  inputRef={UserNameRef}
                  required
                  fullWidth
                  sx={textFieldStyle}
                  />
                  <TextField
                      id="UserFamily"
                      type="text"
                      label="שם משפחה"
                      variant="outlined"
                      inputRef={UserFamilyRef}
                      required
                      fullWidth
                      sx={textFieldStyle}
                      />
                      </>
                    )}
                    
                    <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}
                    >
                    {!isRegister ? (
                    <>
                    <Button type="button" onClick={() => setIsRegister(true)} sx={secondaryButtonStyle}>
                        עוד לא רשום?
                        </Button>
                        <Button type="submit" sx={primaryButtonStyle} disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'התחברות'}
                      </Button>
                      </>
                    ) : (
                    <>
                      <Button type="button" onClick={() => setIsRegister(false)} sx={secondaryButtonStyle}>
                        כבר רשום?
                        </Button>
                      <Button type="submit" sx={primaryButtonStyle} disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'הרשמה'}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Box>
          </Modal>
        </>
      ) : (
        <HomePage />
      )}
      
    </>
  )
}

export default LoginRegister
