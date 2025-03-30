
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import heLocale from "@fullcalendar/core/locales/he";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ImageUpload from "../componnents/UploadImages";
import '../App.css';
import { Button } from "@mui/material";
import { Img } from "../Models/Img";
import UpdateImage from "../componnents/UpdateImage";
import { Trash } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { Upload } from "lucide-react";
import { Download } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { Palette } from "lucide-react";
import DeleteImg from "../componnents/DeleteImg";
import moment from "moment";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ShowTemplates from "../componnents/ShowTemplates";
import { useNavigate } from "react-router";
// import { EventApi } from "@fullcalendar/core/index.js";

export default function CreateCalendarScreen() {
    const [events, setEvents] = useState([]);
    const [upload, setUpload] = useState(false);
    const [ChooseTemplate, setChooseTemplate] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ id: number, eventDate: Date } | null>(null);
    const [deleteImage, setdeleteImage] = useState<{ id: number, eventDate: Date } | null>(null);
    const calendarRef = useRef<FullCalendar | null>(null);
    const calendarContainerRef = useRef<HTMLDivElement | null>(null); // Ref חדש על ה-DIV העוטף
    const [loading, setLoading] = useState(false);
    const [dontShowInDownLoad, setDontShowInDownLoad] = useState(false);
    const [color, setColor] = useState<string>(() => sessionStorage.getItem("Color") || "white");
    const navigate = useNavigate();
    moment.locale("he");

    const fetchImages = async () => {
        try {
            const numOfCalendar = sessionStorage.getItem('numOfCalendar');
            const response = await axios.get(`http://localhost:5204/api/Image/all/${numOfCalendar}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("AuthToken")}` },
            });

            const formattedEvents = response.data?.map((item: Img) => ({
                title: item.event || "📸 אירוע",
                date: item.eventDate,
                id: item.id,
                url: item.url.split("?")[0],
                extendedProps: { id: item.id, eventDate: item.eventDate }
            }));
            setEvents(formattedEvents);
        } catch (error) {
            alert("Error fetching images");
        }
    };

    useEffect(() => {
        fetchImages();
    }, [events]);

    const handleNewImage = () => {
        fetchImages();
        setUpload(false);
    };

    const closeModalPost = () => setUpload(false);
    const closeModalUpdate = () => setSelectedImage(null);
    const setDeleteImageNull = () => setdeleteImage(null);
    const SetChooseTemplate = (colorB: string) => {
        setChooseTemplate(false);
        if (colorB) {
            setColor(colorB);
            sessionStorage.setItem("Color", colorB)
        }
        else {
            setColor(color);
        }
        // console.log(sessionStorage.getItem("Color"));
        // console.log(colorB);
    }

    const loadImages = async () => {
        const images = document.querySelectorAll<HTMLImageElement>("#calendar-container img"); const promises = Array.from(images).map((img) => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve(true);
                } else {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                }
            });
        });
        await Promise.all(promises);
    };

    //נסיון 1 להורדת הלוח 
    // const downloadPDF = async () => {
    //     const pdf = new jsPDF("p", "mm", "a4");

    //     if (calendarRef.current) {
    //         const calendarApi = calendarRef.current.getApi();

    //         if (!calendarApi) {
    //             console.error("calendarApi לא נטען!");
    //             return;
    //         }

    //         setLoading(true);

    //         for (let month = 0; month < 12; month++) {
    //             let Month = month < 9 ? `0${month + 1}` : `${month + 1}`;
    //             const dateString = `2024-${Month}-01`;
    //             const parsedDate = new Date(dateString);

    //             if (isNaN(parsedDate.getTime())) {
    //                 console.error(`❌ תאריך לא חוקי: ${dateString}`);
    //                 continue;
    //             }

    //             calendarApi.gotoDate(dateString);
    //             await new Promise((resolve) => setTimeout(resolve, 800));

    //             const calendarElement = document.getElementById("calendar-container");

    //             if (calendarElement) {
    //                 await loadImages();
    //                 await new Promise((resolve) => setTimeout(resolve, 500));
    //                 const canvas = await html2canvas(calendarElement, {
    //                     scale: 2,
    //                     useCORS: true,
    //                     allowTaint: true
    //                 });

    //                 const imgData = canvas.toDataURL("image/png");

    //                 const imgWidth = 210;
    //                 const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //                 if (month > 0) pdf.addPage();
    //                 pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    //             }
    //         }

    //         setLoading(false);
    //         pdf.save("calendar.pdf");
    //     }
    // };

    //נסיון 2 להורדת הלוח
    // const convertImageToBase64 = async (url:string) => {
    //     try {
    //         const response = await fetch(url);
    //         console.log(response);

    //         const blob = await response.blob();
    //         return new Promise((resolve) => {
    //             const reader = new FileReader();
    //             reader.onloadend = () => resolve(reader.result as string);
    //             reader.readAsDataURL(blob);
    //         });
    //     } catch (error) {
    //         console.error("Error converting image to Base64:", error);
    //         return url; // במקרה של שגיאה, מחזירים את ה-URL המקורי
    //     }
    // };


    // const updateEventImages = async (events:EventApi[]) => {
    //     if (!Array.isArray(events)) {
    //         console.error("Error: events is not an array", events);
    //         return;
    //     }

    //     for (let event of events) {
    //         if (event.url) {
    //             console.log("kkk " + event.url);

    //             // event.url = await convertImageToBase64(event.url) as string;
    //             const link = document.createElement("a");
    //             link.href = event.url;
    //             link.download = "img.png";
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         }
    //     }
    // };

    // /**
    //  * שומר את לוח השנה כקובץ PDF כולל התמונות
    //  * @returns {Promise<void>}
    //  */
    // const handleSaveCalendarAsPDF = async () => {
    //     try {
    //         const pdf = new jsPDF("p", "mm", "a3");
    //         const calendarElement = calendarContainerRef.current;

    //         if (!calendarElement) {
    //             console.error("Calendar container ref is not set.");
    //             return;
    //         }

    //         const calendarApi = calendarRef.current?.getApi?.();
    //         if (!calendarApi) {
    //             console.error("Calendar API is not available.");
    //             return;
    //         }

    //         let events = calendarApi.getEvents();
    //         await updateEventImages(events);

    //         // עדכון ה-URL של התמונות באירועים
    //         events.forEach(event => event.setProp("url", event.url));

    //         await new Promise(resolve => setTimeout(resolve, 500)); // מחכה שהתמונות יתעדכנו

    //         const originalHTML = calendarElement.innerHTML;


    //         for (let month = 0; month < 12; month++) {
    //             calendarApi.gotoDate(new Date(2025, month, 1));
    //             await new Promise((resolve) => setTimeout(resolve, 500));

    //             console.log("Capturing:", calendarElement.innerHTML); // בדיקה שהתוכן נטען

    //             const canvas = await html2canvas(calendarElement, { scale: 2, useCORS: true });
    //             const imgData = canvas.toDataURL("image/png");

    //             if (month !== 0) pdf.addPage();
    //             pdf.addImage(imgData, "PNG", 10, 10, 190, 277);
    //         }

    //         calendarElement.innerHTML = originalHTML;
    //         pdf.save("calendar.pdf");

    //         console.log("Calendar saved as PDF with images.");
    //     } catch (error) {
    //         console.error("Error generating PDF:", error);
    //         alert("שגיאה בהורדת הקובץ.");
    //     }
    // };

    const handleSaveCalendarAsPDF = async () => {
        try {
            setDontShowInDownLoad(true);
            setLoading(true);

            const pdf = new jsPDF("landscape", "mm", "a4");
            const calendarElement = calendarContainerRef.current;

            if (!calendarElement) {
                console.error("Calendar container ref is not set.");
                setLoading(false);
                return;
            }

            const calendarApi = calendarRef.current?.getApi?.();
            if (!calendarApi) {
                console.error("Calendar API is not available.");
                setLoading(false);
                return;
            }

            for (let month = 0; month < 12; month++) {
                // מעבר לחודש הבא בלוח השנה
                calendarApi.gotoDate(new Date(2025, month, 1));
                await new Promise(resolve => setTimeout(resolve, 500)); // מחכה שהכל ייטען

                console.log("Capturing month:", month + 1);

                // צילום הלוח כולל התמונות
                const canvas = await html2canvas(calendarElement, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL("image/png");
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                if (month !== 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            }

            pdf.save("calendar.pdf");
            console.log("Calendar saved as PDF with images.");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("שגיאה בהורדת הקובץ.");
        } finally {
            setLoading(false);
        }
        setDontShowInDownLoad(false);
    };



    useEffect(() => {

    }, [color])


    useEffect(() => {
        // if (calendarRef.current) {
        //     console.log("✅ calendarRef מחובר בהצלחה!", calendarRef.current);
        // } else {
        //     console.error("❌ calendarRef עדיין null!");
        // }
    }, [calendarRef]);

    return (
        <>
            {loading && 
            <div className="banner" style={{left:"2%"}}
            ><h1>......מורידים בשבילך את הלוח! - לא לזוז</h1></div>
            }
            <div>
                <button className="fancy-button" onClick={() => navigate(-1)}>
                    <span>חזרה לעמוד הבית</span>
                </button>


                <Button type="button" onClick={() => setChooseTemplate(true)} style={{
                    position: "absolute",
                    top: '15px',
                    left: '45%',
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    borderRadius: "50%",
                    minWidth: "30px",
                    width: "60px",
                    height: "60px",
                }}>
                    <Palette size={32} />
                </Button>
                {ChooseTemplate &&
                    <ShowTemplates chooseTemplate={SetChooseTemplate}></ShowTemplates>
                }
                <>
                    <Button className="upload-button"
                        onClick={() => setUpload(true)}
                        style={{
                            position: "absolute",
                            top: '15px',
                            left: '50%',
                            background: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            borderRadius: "50%",
                            minWidth: "30px",
                            width: "60px",
                            height: "60px"
                        }}>
                        <Upload size={32} />
                    </Button>

                    {upload && <ImageUpload onUpload={handleNewImage} closeModal={closeModalPost} />}

                    <div
                        id="calendar-container"
                        className="calendar-container"
                        ref={calendarContainerRef}
                        style={{
                            padding: "20px",
                            border: "2px solid Gray",
                            backgroundPosition: "center",
                            borderRadius: '10px',
                            backgroundColor: `${sessionStorage.getItem("Color")}`,
                            margin: "20px"
                        }}
                    >
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            locale={heLocale}
                            initialDate={new Date()}
                            firstDay={0}
                            contentHeight="auto"
                            events={events}
                            eventContent={(eventInfo) => (
                                <div style={{ textAlign: "center" }}>
                                    {eventInfo.event.url && (
                                        <>
                                            <img src={eventInfo.event?.url} crossOrigin="anonymous" alt="" style={{
                                                pointerEvents: "none",
                                                width: "100%",
                                                borderRadius: "4%",
                                                boxShadow: "10px",
                                                alignContent: "center",
                                                display: "flex",
                                                flexDirection: "row-reverse",
                                            }} />
                                            {!dontShowInDownLoad &&
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedImage(eventInfo.event.extendedProps as { id: number; eventDate: Date });
                                                        }}
                                                        style={{
                                                            position: "absolute",
                                                            top: -30,
                                                            right: 5,
                                                            background: "rgba(0, 0, 0, 0.6)",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            minWidth: "30px",
                                                            width: "30px",
                                                            height: "30px"
                                                        }}
                                                    >
                                                        <RefreshCw size={24} />
                                                    </Button>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setdeleteImage(eventInfo.event.extendedProps as { id: number; eventDate: Date });
                                                        }}
                                                        style={{
                                                            position: "absolute",
                                                            top: -30,
                                                            right: 40,
                                                            background: "rgba(0, 0, 0, 0.6)",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            minWidth: "30px",
                                                            width: "30px",
                                                            height: "30px"
                                                        }}
                                                    >
                                                        <Trash size={24} />
                                                    </Button>
                                                </>
                                            }
                                        </>
                                    )}
                                    <div>{eventInfo.event.title}</div>
                                </div>
                            )}
                        />
                        {selectedImage && <UpdateImage id={selectedImage.id} eventDate={selectedImage.eventDate} closeModal={closeModalUpdate} onUpload={handleNewImage} />}
                        {deleteImage && <DeleteImg id={deleteImage.id} onUpload={handleNewImage} closeDelete={setDeleteImageNull} />}
                    </div>

                    <Button onClick={handleSaveCalendarAsPDF} style={{
                        marginTop: "20px", padding: "10px", fontSize: "16px",
                        position: "absolute",
                        top: '1px',
                        left: ' 2%',
                        background: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        minWidth: "30px",
                        width: "120px",
                        height: "50px"
                    }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : <Download size={24} />}
                    </Button>
                </>

            </div>
        </>
    );
}

