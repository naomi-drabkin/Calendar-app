import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/Store';
import { fetchDisignCalendar } from '../Redux/DesignCalendarSlice';


export default function ShowDisignCalendar() {
    const dispatch = useDispatch<AppDispatch>();
    const listCalendars = useSelector((state:RootState)=> state.DesignCalendar.listDesignCalendar)
    
    useEffect(() => {
        dispatch(fetchDisignCalendar());
    }, []);

    useEffect(() => {
    }, [listCalendars]); 


    return (
        <>
            <div>
                {listCalendars.length > 0 ? (
                    listCalendars.map((img, index) => (
                        <img key={index} src={img.PdfUrl} alt="תמונה" width="300px"/>
                    ))
                ) : (
                    <p>אין עיצובים מוכנים להצגה</p>
                )}

            </div>
        </>
    )
}