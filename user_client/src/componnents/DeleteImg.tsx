import axios from 'axios'
import  { useEffect, useRef } from 'react'

export default function DeleteImg({id,onUpload,closeDelete}:{id:number,onUpload:Function,closeDelete:Function}) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current){
            hasRun.current = true;
            return; 
        }
        hasRun.current = true;
        const deleteImg = async () => {
            try {
                await axios.delete(`http://localhost:5204/api/Image/${id}`,
                    {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}`,                        
                            "Content-Type": "application/json"},                       
                    }
                )
                onUpload();
                closeDelete();
            } catch {
                alert("---תקלה במחיקת הקובץ")
            }
        };
        // console.log("🔄 DeleteImg useEffect ran with id:", id);

        deleteImg();

    }, [])

    return (
        <>
        </>
    )
}
