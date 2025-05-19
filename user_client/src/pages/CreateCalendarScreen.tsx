
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
import { _http } from "../App";

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
            // console.log(numOfCalendar);

            const response = await axios.get(`${_http}/api/Image/all/${numOfCalendar}`, {
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

    const SetChooseTemplate = (url: string) => {
        setChooseTemplate(false);
        if (url) {
            const http_url = url.replace("https://", "http://")
            console.log("http_url : " + http_url);

            setColor(http_url);
            sessionStorage.setItem("Color", http_url)
            console.log("--------------------");
            console.log(sessionStorage.getItem("Color"));
        }
        else {
            setColor(color);
        }

    }

    const handleSaveCalendarAsPDF = async () => {
        try {
            setDontShowInDownLoad(true);
            setLoading(true);

            const pdf = new jsPDF("landscape", "mm", "a4");
            const calendarElement = calendarContainerRef.current;
            const backgroundImageUrl = sessionStorage.getItem("Color") || " ";

            if (!calendarElement || !backgroundImageUrl) {
                console.error("Calendar container or background image is missing.");
                setLoading(false);
                return;
            }

            console.log(backgroundImageUrl);


            // טען את התמונה עם fetch
            const bgImageBlob = await fetchImage(backgroundImageUrl);
            const img = new Image();
            img.src = URL.createObjectURL(bgImageBlob);

            await new Promise((resolve) => {
                img.onload = () => resolve(img);
            });

            const calendarApi = calendarRef.current?.getApi?.();
            if (!calendarApi) {
                console.error("Calendar API is not available.");
                setLoading(false);
                return;
            }

            for (let month = 0; month < 12; month++) {
                calendarApi.gotoDate(new Date(2025, month, 1));
                await new Promise(resolve => setTimeout(resolve, 500)); // ממתין לרינדור

                const canvas = await html2canvas(calendarElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: null // כדי לא למחוק את הרקע של ה־CSS
                });

                const imgData = canvas.toDataURL("image/png");
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (month !== 0) pdf.addPage();
                pdf.addImage(img.src, "PNG", 0, 0, imgWidth, imgHeight); // הוספת הרקע
                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // צילום הלוח
            }

            pdf.save("calendar.pdf");
            console.log("Calendar saved as PDF with background image.");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("שגיאה בהורדת הקובץ.");
        } finally {
            setLoading(false);
            setDontShowInDownLoad(false);
        }
    };

    // פונקציה לטעינת התמונה
    const fetchImage = async (url: string) => {
        try {
            console.log("url : " + url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.blob();
        } catch (error) {
            console.error("Error fetching image:", error);
            throw error;
        }
    };


    useEffect(() => {

    }, [color])


    useEffect(() => {

    }, [calendarRef]);


    return (
        <>
            {loading &&
                <div className="banner" style={{ left: "2%" }}
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
                            position: "relative",
                            padding: "20px",
                            border: "2px solid Gray",
                            backgroundPosition: "center",
                            borderRadius: '10px',
                            backgroundColor: '',
                            backgroundImage: `url(${sessionStorage.getItem("Color")}`,
                            objectFit: "contain",
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
                                <div style={{ textAlign: "center", zIndex: 1 }}>
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

