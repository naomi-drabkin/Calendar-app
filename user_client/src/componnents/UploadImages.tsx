import React, { useRef, useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import { jwtdecode, token } from './UpdateUser';
import { jwtDecode } from 'jwt-decode';

const ImageUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const eventDate = useRef<HTMLInputElement>(null);
    const event = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] || null);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        try {

            const response = await axios.get(`http://localhost:5204/api/upload/presigned-url?fileName=${file.name}`);
            const presignedUrl = response.data.url;
            console.log(response.data.url);
            console.log(file.name);

            const uploadResponse = await axios.put(presignedUrl, file.name, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (uploadResponse.status === 200) {
                try {

                    if (token) {

                        const eventDateValue = eventDate.current?.value;
                        const parsedDate = eventDateValue ? new Date(eventDateValue) : new Date();
                        
                        console.log(eventDate.current?.value);
                        console.log(token);
                        console.log({
                            Url: presignedUrl,
                            EventDate: parsedDate.toISOString(),
                            Event: event.current?.value,
                            UserId: jwtDecode<jwtdecode>(token).ID
                        });
                        if (isNaN(parsedDate.getTime())) {
                         
                            alert(`Invalid Date ${eventDateValue}`);
                        } else {

                            await axios.post('http://localhost:5204/api/Image/upload', {
                                Url: presignedUrl,
                                EventDate: parsedDate.toISOString(),
                                Event: event.current?.value || "",
                                UserId: jwtDecode<jwtdecode>(token).ID
                            },
                            {
                                headers: { Authorization: `Bearer ${token}` ,
                                'Content-Type': 'application/json'
                            }
                            });
                            setUploadStatus('Upload Success!');
                        }
                    };

                } catch (error) {
                    console.log(error);
                    setUploadStatus('Upload failed! you are not login');
                }
            }

            else {
                setUploadStatus('Upload failed: ' + uploadResponse.statusText);
            }
        } catch (error) {
            setUploadStatus('Error: ' + error);
        }
    };

    return (
        <div>
            <h2>Upload Image</h2>
            <input type="file" onChange={handleFileChange} />
            <form>
                <TextField id="eventDate" type="date"
                    variant="outlined" inputRef={eventDate}
                    required fullWidth
                    sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
                <TextField id="event" type="text" label="event"
                    variant="outlined" inputRef={event}
                    required fullWidth
                    sx={{ bgcolor: "rgb(249, 249, 249)" }}></TextField>
            </form>
            <button onClick={handleUpload}>Upload</button>
            <p>{uploadStatus}</p>
        </div>
    );
};

export default ImageUpload;
