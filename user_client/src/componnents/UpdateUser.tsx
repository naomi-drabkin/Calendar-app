
import { Box, Button, Grid, Modal, TextField } from '@mui/material';
import { styleModal, textFieldStyle } from '../pages/LoginRegister';
import { FormEvent, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import { Jwt } from '../Models/Jwt';
import { FiSettings } from "react-icons/fi";
import { useNavigate } from 'react-router';
import { _http } from '../App';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export const token = sessionStorage.getItem("AuthToken");
const MySwal = withReactContent(Swal);

export default function UpdateUser({ setDesign }: { setDesign: Function }) {
  const [openUpdateModal, setUpdateOpenModal] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const UserNameRef = useRef<HTMLInputElement>(null);
  const UserFamilyRef = useRef<HTMLInputElement>(null);
  const isToken = sessionStorage.getItem("AuthToken");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [_, setLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const authToken = sessionStorage.getItem("AuthToken");
      if (!authToken) throw new Error("AuthToken is missing");

      const userId = jwtDecode<{ ID: string }>(authToken).ID;

      await axios.put(`${_http}/api/User/${userId}`, {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        UserName: UserNameRef.current?.value,
        UserFamily: UserFamilyRef.current?.value,
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setIsLoading(false);
      setUpdateOpenModal(false);
      await MySwal.fire({
        icon: 'success',
        title: 'העדכון הצליח',
        text: 'הפרטים שלך עודכנו בהצלחה!',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'אישור',
      });

    } catch (error) {
      setIsLoading(false);
      setUpdateOpenModal(false);
      await MySwal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'אירעה תקלה בעת עדכון הפרטים',
        confirmButtonColor: '#d33',
        confirmButtonText: 'סגור',
      });
    } finally {
      
      sessionStorage.setItem("Design", "true");
    }
  };


  const logOut = () => {
    sessionStorage.clear();
    setLogin(true);
    setDesign(false);
    sessionStorage.setItem("Design", `${false}`);
    navigate("/homePage");
  }

  useEffect(() => { }, [token]);


  return (
    <>
      <Grid>
        {isToken &&
          <div className="user-menu">
            <button
              className="menu-button"
              onClick={() => setIsOpenModal(prev => !prev)}
            >
              <i className="fas fa-user-circle">
                <FiSettings size={24} />
              </i>
            </button>

            {isOpenModal && (
              <div className="dropdown-menu">
                <button
                  className="menu-item"
                  onClick={() => {
                    setUpdateOpenModal(true);
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




        <Modal onClose={() => [setUpdateOpenModal(false), setIsOpenModal(false)]} open={openUpdateModal}>
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
                  variant="contained" color="primary" disabled={isLoading}>

                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    'עדכן פרטים'
                  )}

                </Button>
              </>
            </form>
          </Box>
        </Modal>
      </Grid>
    </>
  );
}
