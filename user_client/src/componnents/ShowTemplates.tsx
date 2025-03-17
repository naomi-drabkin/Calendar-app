import axios from "axios";
import { useEffect, useState } from "react";
import { token } from "./UpdateUser";

type Template = {
    url: string,
    // FileName: string
}

export default function ShowTemplates() {
    const [listTemplates, setListTemplate] = useState<Template[]>([]);
    useEffect(() => {
        const fetchAllTemplates = async () => {
            try {
                const res = await axios.get('http://localhost:5204/api/Image/all', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setListTemplate(res.data);
                console.log(res.data);

            } catch (error) {
                console.log(error);

            }
        }

        fetchAllTemplates();

    }, []);

    useEffect(() => {
    }, [listTemplates]); 

    return (
        <>
            <div>
                {listTemplates.length > 0 ? (
                    listTemplates.map((img, index) => (
                        <img key={index} src={img.url} alt="תמונה" width="300px"/>
                    ))
                ) : (
                    <p>אין תמונות להצגה</p>
                )}

            </div>
        </>
    )
}
