import { Button } from "@mui/material";
import ShowTemplates from "./ShowTemplates";
import UpdateUser from "./UpdateUser";
import ImageUpload from "./UploadImages";
import { useState } from "react";
import { useNavigate } from "react-router";


const HomePage = () => {
    const [ShowTemplate, setShowTemplates] = useState(false);
    const Navigate = useNavigate();
    


    return (
        <>
            <ImageUpload />
            <UpdateUser />
            <Button onClick={() => Navigate("/templates")}>הצגת תבניות </Button>

           
            {/* {ShowTemplate && newPage()} */}
            

        </>
        )
}

export default HomePage;