import { Box, Button, Grid, Modal, TextField } from '@mui/material'
import { styleModal } from '../pages/LoginRegister';
import { FormEvent, useRef, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const token = sessionStorage.getItem("AuthToken");
export  type jwtdecode ={
  Token:String,
  ID:Number
}
export default function UpdateUser() {
  const [openModal, setOpenModal] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const UserNameRef = useRef<HTMLInputElement>(null);
  const UserFamilyRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (token) {
        const userId = jwtDecode<jwtdecode>(token).ID;
        console.log(userId);
        console.log(jwtDecode(token));
        const res = await axios.put(`http://localhost:5204/api/User/${userId}`, {
          email: emailRef.current?.value,
          password: passwordRef.current?.value,
          UserName: UserNameRef.current?.value,
          UserFamily: UserFamilyRef.current?.value,
        },
        { headers: {Authorization: `Bearer ${token}`}         
        });
        console.log(res);
        
      }
    } catch(error) {
      console.log(error);

    }
    setOpenModal(false);
  }

  const logOut = ()=>{
    sessionStorage.clear();
    
  }

  return (
    <>
      <Grid>
        <Button type='button' onClick={() => setOpenModal(true)}>Update User</Button>
        <Button type='button' onClick={logOut}>Log Out</Button>

        <Modal onClose={() => setOpenModal(false)} open={openModal}>
          <Box sx={styleModal}>
            <form onSubmit={handleSubmit}>
              <TextField id="email" type="email" label="Email"
                variant="outlined" inputRef={emailRef}
                required fullWidth
                sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
              <TextField id="password" type="password" label="Password"
                variant="outlined" inputRef={passwordRef}
                required fullWidth
                sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
              <TextField id="UserName" type="text" label="UserName"
                variant="outlined" inputRef={UserNameRef}
                required fullWidth
                sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
              <TextField id="UserFamily" type="text" label="UserFamily"
                variant="outlined" inputRef={UserFamilyRef}
                required fullWidth
                sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
              <Button type='submit'>update user</Button>
            </form>
          </Box>
        </Modal>
      </Grid>
    </>
  )
}
