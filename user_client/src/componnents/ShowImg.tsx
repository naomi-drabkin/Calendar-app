import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { _http } from '../App';

const ShowImg = ({ fileName, 
     chooseTemplate }: { fileName: string,
          chooseTemplate: Function }) => {
    const [imgUrl, setImgUrl] = useState(null);

    useEffect(() => {
        const getImageUrl = async () => {
            
            try {
                const response = await axios.get(`${_http}/api/upload/download-url/${fileName}`);
                setImgUrl(response.data);

            } catch (error) {
                alert('שגיאה בהבאת ה-URL:'+ error);
            }
        };
        getImageUrl();
    }, [fileName]);

    return (<>
        {imgUrl != null ? (
            <Button className="image-box" onClick={() => { 
             chooseTemplate(fileName) }}>
                <div style={{
                    backgroundColor: `${fileName}`,
                    width: '50px',
                    height: '50px',
                    borderRadius:'10%',
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    display: "flex",                   
                    padding:'0'
                }}></div>
            </Button>
        ) : (
            <p>טוען תמונה...</p>
        )}
    </>
    )

}

export default ShowImg;
