import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { FormEvent, useRef, useState } from "react";

export const styleModal = {
    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
    width: 400, bgcolor: "white", boxShadow: 24, p: 4, borderRadius: "3px"
};


const LoginRegister = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const UserNameRef = useRef<HTMLInputElement>(null);
    const UserFamilyRef = useRef<HTMLInputElement>(null);
    // const RoleRef = useRef<HTMLInputElement>(null);

    const [isRegister, setIsRegister] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleSubmit = async(event:FormEvent)=>{
        event.preventDefault();
        try{
            if(!isRegister){
                const res = await axios.post("http://localhost:5204/api/User/login", {                   
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value,
                });
                console.log("login");
                
            }
            else{
                const res = await axios.post("http://localhost:5204/api/User/register", {
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value,
                    UserName: passwordRef.current?.value,
                    UserFamily: passwordRef.current?.value,
                    Role:"User"
                });
                console.log("register");
                
            }
        }catch(error){
            console.log(error);
            
        }
        
    }

    return (<>

        <Button type="button" onClick={() => setIsOpenModal(true)}>Login</Button>
        <Button type="button" onClick={() => { setIsRegister(true), setIsOpenModal(true) }}>Register</Button>

        <Modal onClose={() => { setIsOpenModal(false), setIsRegister(false) }} open={isOpenModal}>
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
                    {isRegister && <>
                        <TextField id="UserName" type="text" label="UserName"
                            variant="outlined" inputRef={UserNameRef}
                            required fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
                        <TextField id="UserFamily" type="text" label="UserFamily"
                            variant="outlined" inputRef={UserFamilyRef}
                            required fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
                        {/* <TextField id="Role" type="" label="Role"
                            variant="outlined" inputRef={RoleRef}
                            required fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField> */}
                    </>}
                    {isRegister && <Button type="submit">הרשם</Button>}
                    {!isRegister && <Button type="submit">התחבר</Button>}

                </form>
            </Box>
        </Modal>

    </>)
}

export default LoginRegister;