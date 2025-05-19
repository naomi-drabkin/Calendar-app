// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Template } from "../Models/Template";
// // import { useLocation } from "react-router";
// import { Box, Button, Modal } from "@mui/material";
// import { styleModal } from "../pages/LoginRegister";
// import "../App.css";

// export default function ShowTemplates({ chooseTemplate }: { chooseTemplate: Function }) {
//     const [listTemplates, setListTemplate] = useState<Template[]>([]);
//     const [openModal,setopanModal] = useState(true);
//     // const location = useLocation();
//     // const setColor = location.state?.color;

//     useEffect(() => {
//         const fetchAllTemplates = async () => {
//             try {
//                 const res = await axios.get('http://localhost:5204/api/templates/get-all-templates', {
//                     // headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` }
//                 })
//                 setListTemplate(res.data);
//                 console.log(res.data);

//                 console.log(res.data);
//                 // console.log(res.data);


//             } catch (error) {
//                 alert("ארע תקלה בהצגת התבניות")

//             }
//         }

//         fetchAllTemplates();

//     }, []);

//     useEffect(() => {
//     }, [listTemplates]);

//     return (
//         <>
//             <Modal open={openModal} onClose={()=>{setopanModal(false),chooseTemplate(null)}} 
//             >
//                 <Box sx={styleModal} >
//                     {listTemplates.length > 0 ? (
//                         listTemplates.map((img) => (
//                             // <ShowImg key={index} fileName={img.name} setColor={setColor} chooseTemplate={chooseTemplate} />
//                             <Button onClick={()=>chooseTemplate(img.imageUrl)}>
//                                 <div className="template-item">
//                                 <img style={{width:50,height:50,objectFit:"cover"}} src={img.imageUrl} alt={img.name}></img>
//                                 </div>
//                             </Button>

//                         ))
//                     ) : (
//                         <p></p>
//                     )}
//                      <span className="close-btn" onClick={()=>{setopanModal(false),chooseTemplate(null)}}>
//                         ✖
//                     </span>
//                 </Box>
//             </Modal>
//         </>
//     )
// }


"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Box, Modal } from "@mui/material"
import type { Template } from "../Models/Template"
import "../App.css"
import { _http } from "../App"

// סגנון מעודכן לפופאפ הצגת תבניות
const templatesModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxWidth: "90vw",
    maxHeight: "80vh",
    overflow: "auto",
    bgcolor: "white",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    p: 4,
    borderRadius: "12px",
    outline: "none",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(8px)",
}

export default function ShowTemplates({ chooseTemplate }: { chooseTemplate: Function }) {
    const [listTemplates, setListTemplate] = useState<Template[]>([])
    const [openModal, setopanModal] = useState(true)

    useEffect(() => {
        const fetchAllTemplates = async () => {
            try {
                const res = await axios.get(`${_http}/api/templates/get-all-templates`, {
                    // headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` },
                    // mode: "cors",
                })
                setListTemplate(res.data)
                console.log(res.data)

                console.log(res.data)
                // console.log(res.data);
            } catch (error) {
                alert("ארע תקלה בהצגת התבניות")
            }
        }

        fetchAllTemplates()
    }, [])

    useEffect(() => { }, [listTemplates])

    return (
        <>
            <Modal
                open={openModal}
                onClose={() => {
                    setopanModal(false)
                    chooseTemplate(null)
                }}
            >
                <Box sx={templatesModalStyle}>
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
                            בחירת תבנית
                        </h2>
                        <p
                            style={{
                                margin: "0",
                                color: "#666",
                                fontSize: "16px",
                            }}
                        >
                            בחר תבנית לעיצוב לוח השנה שלך
                        </p>
                    </div>

                    <div
                        dir="rtl"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "16px",
                            marginTop: "20px",
                        }}
                    >
                        {listTemplates.length > 0 ? (
                            listTemplates.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => chooseTemplate(img.imageUrl)}
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease",
                                        position: "relative",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)"
                                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)"
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)"
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "100%",
                                            paddingBottom: "100%",
                                            position: "relative",
                                        }}
                                    >
                                        <img
                                            src={img.imageUrl || "/placeholder.svg"}
                                            alt={img.name}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            padding: "8px",
                                            textAlign: "center",
                                            backgroundColor: "white",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                            borderTop: "1px solid #f0f0f0",
                                        }}
                                    >
                                        {img.name || "תבנית"}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    textAlign: "center",
                                    padding: "40px 0",
                                    color: "#666",
                                }}
                            >
                                טוען תבניות...
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setopanModal(false)
                            chooseTemplate(null)
                        }}
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            // background: "rgba(255, 255, 255, 0.8)",
                            // border: "1px solid rgba(0, 0, 0, 0.1)",
                            cursor: "pointer",
                            color: "rgba(17, 16, 16, 0.8)",
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            borderRadius: "30%",
                            // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.2s ease",
                            zIndex: 10,
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#f5f5f5"
                            e.currentTarget.style.transform = "scale(1.05)"
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
                            e.currentTarget.style.transform = "scale(1)"
                        }}
                    >
                        ✖
                    </button>
                </Box>
            </Modal>
        </>
    )
}
