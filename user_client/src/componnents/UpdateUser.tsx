// import { Box, Button, Grid, Modal, TextField } from '@mui/material'
// import { styleModal } from '../pages/LoginRegister';
// import { FormEvent, useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { Jwt } from '../Models/Jwt';
// import { FiSettings } from "react-icons/fi";
// import { useNavigate } from 'react-router';

// export const token = sessionStorage.getItem("AuthToken");

// export default function UpdateUser({setDesign}:{setDesign:Function}) {
//   const [openModal, setOpenModal] = useState(false);
//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const UserNameRef = useRef<HTMLInputElement>(null);
//   const UserFamilyRef = useRef<HTMLInputElement>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [_,setLogin]=useState(false);
//   const navigate = useNavigate();
//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();
//     try {
//       if (token) {
//         const userId = jwtDecode<Jwt>(token).ID;
//         // console.log(userId);
//         // console.log(jwtDecode(token));
//         await axios.put(`http://localhost:5204/api/User/${userId}`, {
//           email: emailRef.current?.value,
//           password: passwordRef.current?.value,
//           UserName: UserNameRef.current?.value,
//           UserFamily: UserFamilyRef.current?.value,
//         },
//           {
//             headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` }
//           });
//         // console.log(res);

//       }
//     } catch (error) {
//       alert("ארע תקלה בעת עדכון פרטיך")

//     }
//     setOpenModal(false);
//     sessionStorage.setItem("Design",`${true}`)

//   }

//   const logOut = () => {
//     sessionStorage.clear();
//     alert('התנתקת מהאתר')
//     setLogin(true);
//     setDesign(false)
//     sessionStorage.setItem("Design",`${false}`)
//     navigate("/homePage");
//   }

//   useEffect(()=>{

//   },[token])

//   return (
//     <>
//       <Grid>


//       <div className="user-menu">
//             {/* כפתור ראשי */}
//             <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
//                 <i className="fas fa-user-circle"> <FiSettings size={24} /> </i>
//             </button>

//             {/* תפריט נפתח */}
//             {isOpen && (
//                 <div className="dropdown-menu">
//                     <button className="menu-item" onClick={() => {setOpenModal(true),setIsOpen(!isOpen)}}>עדכון משתמש</button>
//                     <button className="menu-item logout" onClick={()=>{logOut(),setIsOpen(!isOpen)}}>יציאה</button>
//                 </div>
//             )}
//         </div>



//         {/* <Button type='button' onClick={() => setOpenModal(true)}>Update User</Button>
//         <Button type='button' onClick={logOut}>Log Out</Button> */}

//         <Modal onClose={() => setOpenModal(false)} open={openModal}>
//           <Box sx={styleModal}>
//             <form onSubmit={handleSubmit}>
//               <TextField id="email" type="email" label="Email"
//                 variant="outlined" inputRef={emailRef}
//                 required fullWidth
//                 sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
//               <TextField id="password" type="password" label="Password"
//                 variant="outlined" inputRef={passwordRef}
//                 required fullWidth
//                 sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
//               <TextField id="UserName" type="text" label="UserName"
//                 variant="outlined" inputRef={UserNameRef}
//                 required fullWidth
//                 sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
//               <TextField id="UserFamily" type="text" label="UserFamily"
//                 variant="outlined" inputRef={UserFamilyRef}
//                 required fullWidth
//                 sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
//               <Button type='submit'>update user</Button>
//             </form>
//           </Box>
//         </Modal>
//       </Grid>
//     </>
//   )
// }



import { Alert, Box, Button, Grid, Modal, TextField } from '@mui/material';
import { Snackbar } from "@mui/material";
import { styleModal, textFieldStyle } from '../pages/LoginRegister';
import { FormEvent, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Jwt } from '../Models/Jwt';
import { FiSettings } from "react-icons/fi";
import { useNavigate } from 'react-router';
import { _http } from '../App';

export const token = sessionStorage.getItem("AuthToken");

export default function UpdateUser({ setDesign }: { setDesign: Function }) {
  const [openModal, setOpenModal] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const UserNameRef = useRef<HTMLInputElement>(null);
  const UserFamilyRef = useRef<HTMLInputElement>(null);
  const isToken = sessionStorage.getItem("AuthToken");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [_, setLogin] = useState(false);
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    event.preventDefault();
    if (reason === "clickaway") return;
    setOpenAlert(false);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const authToken = sessionStorage.getItem("AuthToken");
      if (!authToken) {
        throw new Error("AuthToken is missing");
      }
      const userId = jwtDecode<Jwt>(authToken).ID;
      await axios.put(`${_http}/api/User/${userId}`, {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        UserName: UserNameRef.current?.value,
        UserFamily: UserFamilyRef.current?.value,
      },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` }
        });

      console.log("פרטיך מתעדכנים...");

    } catch (error) {
      console.log("ארע תקלה בעת עדכון פרטיך");

    }
    setOpenModal(false);
    sessionStorage.setItem("Design", `${true}`);
  }

  const logOut = () => {
    sessionStorage.clear();
    setLogin(true);
    setDesign(false);
    sessionStorage.setItem("Design", `${false}`);
    navigate("/homePage");
  }

  useEffect(() => { }, [token]);

  // useEffect(() => {
  //   if (!isToken) {
  //     setOpenAlert(true);
  //   }
  // }, [isToken]);

  return (
    <>
      <Grid>
        {isToken &&
          <div className="user-menu">
            <button className="menu-button" onClick={() => [setIsOpenModal(!isOpenModal),setOpenModal(!openModal)]}>
              <i className="fas fa-user-circle"> <FiSettings size={24} /> </i>
            </button>

            {isOpenModal && (
              <div className="dropdown-menu">
                <button
                  className="menu-item"
                  onClick={() => {
                    setOpenModal(true);
                    setIsOpenModal(false);
                  }}
                >
                  עדכון משתמש
                </button>
                <button
                  className="menu-item logout"
                  onClick={() => {
                    logOut();
                    setIsOpenModal(false);
                  }}
                >
                  יציאה
                </button>
              </div>
            )}
          </div>

        }

        {openAlert && (
          <Snackbar
            open={openAlert}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity="warning"
              variant="filled"
              sx={{ width: "100%" , color: "#fff", backgroundColor: "#f57c00" }}
            >
              יש להתחבר תחילה
            </Alert>
          </Snackbar>
        )}


        <Modal onClose={() => [setOpenModal(false), setIsOpenModal(false)]} open={openModal}>
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
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <>
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

                <Button type="button"
                  onClick={(e) => {
                    console.log("נלחץ כפתור עדכון");
                    handleSubmit(e as any);
                  }}
                  variant="contained" color="primary">עדכן משתמש</Button>
              </>
            </form>
          </Box>
        </Modal>
      </Grid>
    </>
  );
}
