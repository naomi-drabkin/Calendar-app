import "../App.css";
import { FaHeart, FaRegHeart, FaHeartbeat, FaHeartBroken, FaHandsHelping, FaGift, FaUserFriends } from "react-icons/fa";


export default function DesignScreen() {
    const heartIcons = [
        { icon: <FaHeart />, color: "#3b82f6", text: "להורים" },
        { icon: <FaRegHeart />, color: "#ff4dff", text: "למשפחה" },
        { icon: <FaHeartbeat />, color: "#c30052", text: "לצוות" },
        { icon: <FaHeartBroken />, color: "#ff1a40", text: "לחבר" },
        { icon: <FaHandsHelping />, color: "#ff6600", text: "לעמית" },
        { icon: <FaGift />, color: "#009966", text: "למתנה" },
        { icon: <FaUserFriends />, color: "#00bcd4", text: "אישי" },
    ];

    return (
        <>

            <div className="banner">
                <div className="content">
                    <h3 className="small-title">MomenTo <span className="bold"> - Create</span> Calendar</h3>
                    <h1 className="main-title">עיצוב רגעים מאושרים</h1>
                    <p className="date">עיצוב לוחות שנה בהתאמה אישית - מעולם לא היה קל יותר</p>
                </div>
            </div>
            {/* <div className="icons-container"> */}
            {/* <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #3b82f6"}}>
                <i className="fas fa-tv"></i>
            </div>
            <p>להורים</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #ff4dff"}}>
                <i className="fas fa-video"></i>
            </div>
            <p>למשפחה</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #c30052"}}>
                <i className="fas fa-graduation-cap"></i>
            </div>
            <p>לצוות</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #ff1a40"}}>
                <i className="fas fa-heart"></i>
            </div>
            <p>לחבר</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #ff6600"}}>
                <i className="fas fa-chalkboard"></i>
            </div>
            <p>לעמית</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #009966"}}>
                <i className="fas fa-phone-alt"></i>
            </div>
            <p>למתנה</p>
        </div>

        <div className="icon-item">
            <div className="icon-circle" style={{backgroundColor:" #00bcd4"}}>
                <i className="fas fa-server"></i>
            </div>
            <p>אישי</p>
        </div>
    </div> */}


            <div className="icon-container">
                {heartIcons.map((item, index) => (
                    <div className="icon-item" key={index}>
                        <div className="icon-circle" style={{ backgroundColor: item.color }}>
                            {item.icon}
                        </div>
                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </>
    )
}
