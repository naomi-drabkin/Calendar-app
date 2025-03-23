import { Box, Modal, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { styleModal } from '../pages/LoginRegister';
import axios from 'axios';
import { token } from './UpdateUser';
import { jwtDecode } from 'jwt-decode';
import { Jwt } from '../Models/Jwt';
import {CircularProgress } from "@mui/material";

import '../App.css';
// interface ImageUploadProps {
//     closeModal: () => void;
//     onUpload:()=>void;
// }
export default function UpdateImage({ id,eventDate,closeModal,onUpload}:{id : number,eventDate:Date,closeModal:Function,onUpload:Function}) {
    const [file, setFile] = useState<File | null>(null);
    const [openModal, setOpenMOdal] = useState(true);
    const event = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    let presignedUrl: string;
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleUpdate = async () => {
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

            console.log("Presigned URL:", presignedUrl);
            console.log("File Name:", file.name);

            const uploadResponse = await axios.put(presignedUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (uploadResponse.status === 200) {
                UpdateImage();
            } else {
                setUploadStatus("Upload failed: " + uploadResponse.statusText);
            }
        } catch (error) {
            setUploadStatus("Error: " + error);
        }
        setLoading(false);
    };

    const UpdateImage = async () => {
        try {
            if (token) {
                console.log("Uploaded URL (clean):", presignedUrl.split("?")[0]);
                console.log({
                    url: presignedUrl.split("?")[0],
                    EventDate: eventDate,
                    Event: event.current?.value,
                    UserId: jwtDecode<Jwt>(token).ID,
                    FileName: file?.name,
                });

                await axios.put(
                    `http://localhost:5204/api/Image/${id}`,
                    {
                        Url: presignedUrl.split("?")[0],
                        EventDate:eventDate,
                        Event: event.current?.value ,
                        UserId: jwtDecode<Jwt>(token).ID,
                        FileName: file?.name,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setUploadStatus("Update Success! ✅");
                onUpload();

                // onUpload();
                setOpenMOdal(false);
                closeModal();
            }

        } catch (error) {
            alert("Error saving image");
            setUploadStatus("Update failed! You are not logged in.");
        }

    }

    return (
        <>
            <Modal open={openModal} onClose={() => setOpenMOdal(false)}>
                <Box sx={styleModal}>
                    <h2>Update Image</h2>
                    <input type="file" onChange={handleFileChange} />
                    <form>
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
                                       }}/> : <button onClick={handleUpdate}>Update</button>}

                    <span className="close-btn" onClick={() => {setOpenMOdal(false),closeModal()}}>
                        ✖
                    </span>
                    <p>{uploadStatus}</p>
                </Box>
            </Modal>
        </>
    )
}
