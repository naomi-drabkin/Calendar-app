import axios from "axios";
import { useEffect, useState } from "react";
import { Template } from "../Models/Template";
import ShowImg from "./ShowImg";
import { useLocation } from "react-router";
import { Box, Modal } from "@mui/material";
import { styleModal } from "../pages/LoginRegister";


export default function ShowTemplates({ chooseTemplate }: { chooseTemplate: Function }) {
    const [listTemplates, setListTemplate] = useState<Template[]>([]);
    const [openModal,setopanModal] = useState(true);
    const location = useLocation();
    const setColor = location.state?.color;

    useEffect(() => {
        const fetchAllTemplates = async () => {
            try {
                const res = await axios.get('http://localhost:5204/api/templates', {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` }
                })
                setListTemplate(res.data);
                // console.log(res.data);
                // console.log(res.data);


            } catch (error) {
                alert("ארע תקלה בהצגת התבניות")

            }
        }

        fetchAllTemplates();

    }, []);

    useEffect(() => {
    }, [listTemplates]);

    return (
        <>
            <Modal open={openModal} onClose={()=>{setopanModal(false),chooseTemplate(null)}} 
            >
                <Box sx={styleModal} >
                    {listTemplates.length > 0 ? (
                        listTemplates.map((img, index) => (
                            <ShowImg key={index} fileName={img.name} setColor={setColor} chooseTemplate={chooseTemplate} />
                        ))
                    ) : (
                        <p></p>
                    )}
                     <span className="close-btn" onClick={()=>{setopanModal(false),chooseTemplate(null)}}>
                        ✖
                    </span>
                </Box>
            </Modal>
        </>
    )
}
