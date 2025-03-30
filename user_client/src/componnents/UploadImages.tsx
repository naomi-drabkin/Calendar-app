
import React, { useRef, useState } from "react";
import axios from "axios";
import { Box, Modal, TextField } from "@mui/material";
import { token } from "./UpdateUser";
import { jwtDecode } from "jwt-decode";
import { Jwt } from "../Models/Jwt";
import { styleModal } from "../pages/LoginRegister";
import { CircularProgress } from "@mui/material";

interface ImageUploadProps {
    onUpload: () => void; // פונקציה שמתעדכנת אחרי העלאה
    closeModal: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, closeModal }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const eventDate = useRef<HTMLInputElement>(null);
    const event = useRef<HTMLInputElement>(null);
    const [openModal, setOpenMOdal] = useState(true);
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
                `http://localhost:5204/api/upload/presigned-url?fileName=${file.name}`
            );
            presignedUrl = response.data.url;

            // console.log("Presigned URL:", presignedUrl);
            console.log("File Name:", file.name);

            const uploadResponse = await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
            console.log(uploadResponse.status );
            
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
            var token =  sessionStorage.getItem("AuthToken");
            if (token) {
                const eventDateValue = eventDate.current?.value;
                const parsedDate = eventDateValue
                    ? new Date(eventDateValue)
                    : new Date();

                // console.log("Event Date:", eventDate.current?.value);
                // console.log("Token:", token);

                if (isNaN(parsedDate.getTime())) {
                    alert(`Invalid Date: ${eventDateValue}`);
                } else {
                    // console.log("Uploaded URL (clean):", presignedUrl.split("?")[0]);
                    // console.log({
                    //     Url: presignedUrl.split("?")[0], // מסיר פרמטרים מיותרים
                    //     EventDate: parsedDate.toISOString(),
                    //     Event: event.current?.value || "",
                    //     UserId: jwtDecode<Jwt>(token).ID,
                    //     FileName: file?.name,
                    // });
                    console.log("התמונה בהלאעה");
                    
                    await axios.post(
                        "http://localhost:5204/api/Image/upload",
                        {
                            Url: presignedUrl.split("?")[0],
                            EventDate: parsedDate.toISOString(),
                            Event: event.current?.value || "",
                            UserId: jwtDecode<Jwt>(token).ID,
                            FileName: file?.name,
                            NumOfCalendar:sessionStorage.getItem("numOfCalendar")
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
                    // setdate(parsedDate.toISOString());
                }
            }
        } catch (error) {
            alert("Error saving image");
            setUploadStatus("Upload failed! You are not logged in.");
        }
    }

    return (
        <>
            <Modal open={openModal} onClose={() => setOpenMOdal(false)}>
                <Box sx={styleModal}>
                    <h2>Upload Image</h2>
                    <input type="file" onChange={handleFileChange} />
                    <form>
                        <TextField
                            id="eventDate"
                            type="date"
                            variant="outlined"
                            inputRef={eventDate}
                            required
                            fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}
                        />

                        <TextField
                            id="event"
                            type="text"
                            label="Event"
                            variant="outlined"
                            inputRef={event}
                            required
                            fullWidth
                            sx={{ bgcolor: "rgb(249, 249, 249)" }}
                        />
                    </form>
                   {loading? <CircularProgress size={15} color="inherit" style={{
                        position: "absolute",
                        top: "50%",
                        right:' 50%',
                        background: "rgba(255, 255, 255, 0.22)",
                        color: "gray",
                        borderRadius: "50%",
                        minWidth: "10px",
                        width: "50px",
                        height: "50px"
                   }}/> : <button onClick={handleUpload}>Upload</button>}
                    <p>{uploadStatus}</p>
                    <span className="close-btn" onClick={closeModal}>
                        ✖
                    </span>
                </Box>
            </Modal>
        </>
    );
};

export default ImageUpload;
