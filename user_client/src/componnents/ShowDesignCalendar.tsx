import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/Store';
import { fetchDisignCalendar } from '../Redux/DesignCalendarSlice';
import { useNavigate } from 'react-router';
import { AiOutlineCalendar } from "react-icons/ai";  // Ant Design - מודרני ושטוח


export default function ShowDisignCalendar() {
    const dispatch = useDispatch<AppDispatch>();
    const token = sessionStorage.getItem("AuthToken");
    const listCalendars = useSelector((state: RootState) => state.DesignCalendar.listDesignCalendar)
    const Navigate = useNavigate();
        
    useEffect(() => {
        if (!token) return; 
        dispatch(fetchDisignCalendar());
    }, []); //


    useEffect(() => {
        
    }, [listCalendars]);


    return (
        <>
            {listCalendars.length > 0 && 
                <p style={{fontSize:"15px",fontWeight:"normal",position:"absolute",top:"63%",justifyContent:"center"}}>עיצובים אחרונים</p>
            }
            <div className="calendarDesign-container">
                {listCalendars.length > 0 ? (
                    listCalendars.map((img, index) => (
                        <button className="calendarDesign-box" type='button' onClick={() => { sessionStorage.setItem("numOfCalendar",JSON.stringify(index+1)); Navigate(`/createCalendar`) }}>
                            <span className="calendarDesign-icon" ><AiOutlineCalendar/></span>
                            <p key={index}>{img.title}</p>
                        </button>
                    ))
                ) : (
                    <p></p>
                )}
            </div>
        </>
    )
}

