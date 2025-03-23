// import { Box, Modal, TextField } from '@mui/material'
// import React from 'react'
// import { styleModal } from '../pages/LoginRegister';

// interface ImageModalProps {
//     setOpenMOdal: () => void; // פונקציה שמתעדכנת אחרי העלאה
//     handleFileChange:()=> void;
//     handleUpload:()=>void;
// }


// export default function ImageModal({setOpenMOdal,handleFileChange,openModal,handleUpload}:{setOpenMOdal:Function ,handleFileChange:Function,openModal:boolean,handleUpload:Function})    
// {
//   return (
//     <>
    
//     <Modal open={openModal} onClose={() => setOpenMOdal}>
//                 <Box sx={styleModal}>
//                     <h2>Upload Image</h2>
//                     <input type="file" onChange={handleFileChange()} />
//                     <form>
//                         <TextField
//                             id="event"
//                             type="text"
//                             label="Event"
//                             variant="outlined"
//                             inputRef={event}
//                             required
//                             fullWidth
//                             sx={{ bgcolor: "rgb(249, 249, 249)" }}
//                         />
//                     </form>
//                     <button onClick={handleUpload()}>Update</button>
//                     <span className="close-btn" onClick={setOpenMOdal()}>
//                                 ✖
//                     </span>
//                     {/* <p>{uploadStatus}</p> */}
//                 </Box>
//             </Modal>
//     </>
//   )
// }
