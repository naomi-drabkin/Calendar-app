
"use client"

import type React from "react"
import { useRef, useState } from "react"
import axios from "axios"
import { Box, Modal, TextField, CircularProgress } from "@mui/material"
import { jwtDecode } from "jwt-decode"
import type { Jwt } from "../Models/Jwt"
import { Upload} from "lucide-react"
import { _http } from "../App"

interface ImageUploadProps {
    onUpload: () => void
    closeModal: () => void
}

// סגנון מעודכן לפופאפ העלאת תמונה
const uploadModalStyle = {
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

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, closeModal }) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploadStatus, setUploadStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const eventDate = useRef<HTMLInputElement>(null)
    const event = useRef<HTMLInputElement>(null)
    const [openModal, setOpenMOdal] = useState(true)
    let presignedUrl!: string

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("Please select a file to upload.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${_http}/api/upload/presigned-url?fileName=${file.name}`
            );
            presignedUrl = response.data.url;

            console.log("File Name:", file.name);

            const uploadResponse = await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
            console.log(uploadResponse.status);

            if (uploadResponse.status == 200 || uploadResponse.status === 204 || uploadResponse.status === 201) {
                console.log("Uploading Success!");
                postImage();
            }
            else {
                setUploadStatus("Upload failed: " + uploadResponse.statusText);
            }
        } catch (error) {
            setUploadStatus("Error: " + error);
        }
        setLoading(false);
    };

    const postImage = async () => {
        try {
            var token = sessionStorage.getItem("AuthToken");
            if (token) {
                const eventDateValue = eventDate.current?.value;
                const parsedDate = eventDateValue
                    ? new Date(eventDateValue)
                    : new Date();


                if (isNaN(parsedDate.getTime())) {
                    alert(`Invalid Date: ${eventDateValue}`);
                } else {
                    console.log("התמונה בהלאעה");

                    await axios.post(
                        `${_http}/api/Image/upload`,
                        {
                            Url: presignedUrl.split("?")[0],
                            EventDate: parsedDate.toISOString(),
                            Event: event.current?.value || "",
                            UserId: jwtDecode<Jwt>(token).ID,
                            FileName: file?.name,
                            NumOfCalendar: sessionStorage.getItem("numOfCalendar")
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}`,
                                "Content-Type": "application/json",
                            },
                        }

                    );

                    setUploadStatus("Upload Success! ✅");

                    onUpload();
                    setOpenMOdal(false)
                }
            }
        } catch (error) {
            alert("Error saving image");
            setUploadStatus("Upload failed! You are not logged in.");
        }
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
            <Modal open={openModal} onClose={() => {setOpenMOdal(false)}}>
                <Box sx={uploadModalStyle}>
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
                            העלאת תמונה
                        </h2>
                        <p
                            style={{
                                margin: "0",
                                color: "#666",
                                fontSize: "16px",
                            }}
                        >
                            בחר תמונה והוסף פרטי אירוע
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
                                htmlFor="file-upload"
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
                                    <span style={{ color: "#666" }}>{file ? file.name : "לחץ כאן לבחירת קובץ או גרור לכאן"}</span>
                                </div>
                                <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                            </label>
                        </div>

                        <form style={{ marginBottom: "20px" }}>
                            <div style={{ marginBottom: "16px" }}>
                                <label
                                    htmlFor="eventDate"
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                        fontWeight: "500",
                                        color: "#333",
                                    }}
                                >
                                    תאריך האירוע
                                </label>
                                <TextField
                                    id="eventDate"
                                    type="date"
                                    variant="outlined"
                                    inputRef={eventDate}
                                    required
                                    fullWidth
                                    sx={textFieldStyle}
                                />
                            </div>

                            <TextField
                                id="event"
                                type="text"
                                label="שם האירוע"
                                variant="outlined"
                                inputRef={event}
                                required
                                fullWidth
                                sx={textFieldStyle}
                            />
                        </form>

                        <button
                            onClick={handleUpload}
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
                            {loading ? "מעלה..." : "העלה תמונה"}
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

export default ImageUpload
