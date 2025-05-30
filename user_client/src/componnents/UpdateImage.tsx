import { Box, Modal, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Jwt } from '../Models/Jwt';
import { CircularProgress } from "@mui/material";

import '../App.css';
import { Upload } from 'lucide-react';
import { _http } from '../App';

export default function UpdateImage({ id, eventDate, url, event, closeModal, onUpload }: { id: number, eventDate: Date, url: string, event: string, closeModal: Function, onUpload: Function }) {
    const [file, setFile] = useState<File | null>(null);
    const [openModal, setOpenMOdal] = useState(true);
    const newEvent = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    let presignedUrl: string = url;
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleUpdate = async () => {
        const newEventValue = newEvent.current?.value?.trim() || "";
        const isImageChanged = !!file;
        const isEventChanged = newEventValue !== event;
    
        if (!isImageChanged && !isEventChanged) {
            setUploadStatus("יש לעדכן את התמונה או את האירוע לפחות.");
            return;
        }
    
        setLoading(true);
    
        let finalUrl = url;
        let finalEvent = event;               
        try {
            if (isImageChanged && file) {
                const response = await axios.get(
                    `${_http}/api/upload/presigned-url?fileName=${file.name}`
                );
    
                presignedUrl = response.data.url;
    
                const uploadResponse = await axios.put(presignedUrl, file, {
                    headers: { "Content-Type": file.type },
                });
    
                if (uploadResponse.status !== 200) {
                    setUploadStatus("העלאת קובץ נכשלה");
                    return;
                }
    
                finalUrl = presignedUrl.split("?")[0];
            }
    
            if (isEventChanged) {
                finalEvent = newEventValue;
            }
    
            await UpdateImage(finalUrl, finalEvent);
    
            setUploadStatus("עודכן בהצלחה ✅");
            onUpload();
            setOpenMOdal(false);
            closeModal();
        } catch (error) {
            console.error("שגיאה בעדכון:", error);
            setUploadStatus("שגיאה בעדכון: " + error);
        } finally {
            setLoading(false);
        }
    };
    


    const UpdateImage = async (updatedUrl: string, updatedEvent: string) => {
        try {
            const token = sessionStorage.getItem("AuthToken");
            if (!token) {
                setUploadStatus("עדכון נכשל – אין התחברות");
                return;
            }

            const numOfCalendar = sessionStorage.getItem("numOfCalendar");

            await axios.put(
                `${_http}/api/Image/${id}`,
                {
                    Url: updatedUrl,
                    EventDate: eventDate,
                    Event: updatedEvent,
                    UserId: jwtDecode<Jwt>(token).ID,
                    FileName: file?.name ?? "",
                    NumOfCalendar: numOfCalendar
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            )
        } catch (error) {
            alert("Error saving image");
            setUploadStatus("Update failed! You are not logged in.");
        }

    }

    const updateModalStyle = {
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

    return (
        <>

            <Modal open={openModal} onClose={() => { setOpenMOdal(false), closeModal() }}>
                <Box sx={updateModalStyle}>
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
                            עדכון תמונה
                        </h2>
                        <p
                            style={{
                                margin: "0",
                                color: "#666",
                                fontSize: "16px",
                            }}
                        >
                            בחר תמונה חדשה או עדכן את פרטי האירוע
                        </p>
                    </div>

                    <div dir="rtl">
                        <div
                            style={{
                                marginBottom: "20px",
                                border: "2px dashed #e0e0e0",
                                borderRadius: "8px",
                                padding: "20px",
                                textAlign: "center",
                                backgroundColor: "rgb(249, 249, 249)",
                            }}
                        >
                            <label
                                htmlFor="file-upload-update"
                                style={{
                                    display: "block",
                                    cursor: "pointer",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <Upload size={24} color="#8a2be2" />
                                    <span style={{ color: "#666" }}>{file ? file.name : presignedUrl }</span>
                                </div>
                                <input id="file-upload-update" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                            </label>
                        </div>

                        <form style={{ marginBottom: "20px" }}>
                            <TextField
                                id="event"
                                type="text"
                                label="שם הארוע"
                                placeholder={event}
                                variant="outlined"
                                inputRef={newEvent}
                                required
                                fullWidth
                                sx={textFieldStyle}
                            />
                        </form>

                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "none",
                                background: "linear-gradient(90deg, #00c6ff 0%, #8a2be2 100%)",
                                color: "white",
                                fontWeight: "bold",
                                cursor: loading ? "not-allowed" : "pointer",
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 12px rgba(138, 43, 226, 0.2)",
                            }}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(138, 43, 226, 0.3)"
                                    e.currentTarget.style.transform = "translateY(-1px)"
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(138, 43, 226, 0.2)"
                                e.currentTarget.style.transform = "translateY(0)"
                            }}
                        >
                            {loading ? "מעדכן..." : "עדכן תמונה"}
                            {loading && (
                                <CircularProgress
                                    size={20}
                                    style={{
                                        color: "white",
                                        position: "absolute",
                                        right: "20px",
                                    }}
                                />
                            )}
                        </button>

                        {uploadStatus && (
                            <p
                                style={{
                                    margin: "16px 0",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    backgroundColor: uploadStatus.includes("Success") ? "rgba(0, 200, 83, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                    color: uploadStatus.includes("Success") ? "#00c853" : "#f44336",
                                    textAlign: "center",
                                }}
                            >
                                {uploadStatus}
                            </p>
                        )}

                        <button
                            onClick={() => {
                                setOpenMOdal(false)
                                closeModal()
                            }}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",                           
                                cursor: "pointer",
                                color: "rgba(17, 16, 16, 0.8)",
                                fontSize: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                borderRadius: "30%",
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

                    </div>


                </Box>
            </Modal>
        </>
    )
}
