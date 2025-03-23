
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import heLocale from "@fullcalendar/core/locales/he";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import ImageUpload from "../componnents/UploadImages";
import '../App.css';
import { Button } from "@mui/material";
import { token } from "../componnents/UpdateUser";
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

export default function CreateCalendarScreen() {
    const [events, setEvents] = useState([]);
    const [upload, setUpload] = useState(false);
    const [ChooseTemplate, setChooseTemplate] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ id: number, eventDate: Date } | null>(null);
    const [deleteImage, setdeleteImage] = useState<{ id: number, eventDate: Date } | null>(null);
    const calendarRef = useRef<FullCalendar | null>(null);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState<string>(() => sessionStorage.getItem("Color") || "white");
    const navigate = useNavigate();
    moment.locale("he");

    const fetchImages = async () => {
        try {
            const numOfCalendar = sessionStorage.getItem('numOfCalendar');            
            const response = await axios.get(`http://localhost:5204/api/Image/all/${numOfCalendar}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const formattedEvents = response.data.map((item: Img) => ({
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
        console.log(sessionStorage.getItem("Color"));
        console.log(colorB);
    }

    const downloadPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4"); // יצירת קובץ PDF בפורמט A4
        console.log(calendarRef.current);
        console.log(calendarRef);


        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            console.log(calendarRef.current.getApi());

            if (!calendarApi) {
                console.error("calendarApi לא נטען!");
                return;
            }

            setLoading(true);
            console.log("oooooooooooooooo");


            for (let month = 0; month < 12; month++) {
                let Month = month< 9 ? `0${month +1}`: `${month +1}`;
                const dateString = `2024-${Month}-01`;
                const parsedDate = new Date(dateString);
                console.log(isNaN(parsedDate.getTime()));
                
                // בדיקה אם התאריך תקף
                if (isNaN(parsedDate.getTime())) {
                    console.error(`❌ תאריך לא חוקי: ${dateString}`);
                    continue;
                }


                calendarApi.gotoDate(dateString);
                await new Promise((resolve) => setTimeout(resolve, 800));
                console.log("lllllllllllllllllll");

                const calendarElement = document.getElementById("calendar-container");
                if (calendarElement) {
                    const canvas = await html2canvas(calendarElement, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL("image/png");
                    console.log("rrrrrrrrrrrrrrrrr");

                    const imgWidth = 210;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    if (month > 0) pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                }
            }

            setLoading(false);
            pdf.save("calendar.pdf");
        }
    };


    useEffect(() => {

    }, [color])


    useEffect(() => {
        if (calendarRef.current) {
            console.log("✅ calendarRef מחובר בהצלחה!", calendarRef.current);
        } else {
            console.error("❌ calendarRef עדיין null!");
        }
    }, [calendarRef]);

    return (
        <>
            <div>
                <Button type="button" onClick={() => navigate(-1)}>חזרה לעמוד הראשי</Button>

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
                        style={{
                            padding: "20px",
                            border: "2px solid Gray",
                            backgroundPosition: "center",
                            borderRadius: '10px',
                            backgroundColor: `${sessionStorage.getItem("Color")}`,
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
                                            <img src={eventInfo.event?.url} alt="" style={{
                                                pointerEvents: "none",
                                                width: "100%",
                                                borderRadius: "4%",
                                                boxShadow: "10px",
                                                alignContent: "center",
                                                display: "flex",
                                                flexDirection: "row-reverse",

                                            }} />
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
                                    )}
                                    <div>{eventInfo.event.title}</div>
                                </div>
                            )}
                        />
                        {selectedImage && <UpdateImage id={selectedImage.id} eventDate={selectedImage.eventDate} closeModal={closeModalUpdate} onUpload={handleNewImage} />}
                        {deleteImage && <DeleteImg id={deleteImage.id} onUpload={handleNewImage} closeDelete={setDeleteImageNull} />}
                    </div>

                    <Button onClick={downloadPDF} style={{
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

