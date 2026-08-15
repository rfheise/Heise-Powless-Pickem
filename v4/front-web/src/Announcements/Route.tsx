import React, {useEffect, useState} from 'react'
import Background from '../Background/Background'
import API  from '../Form/API'
import Announcement, {AnnouncementInterface} from "./Announcement"
import "./announcement.css"
//announcements page
export default function Announcements() {
    const [announcements, setAnnouncements] = useState<AnnouncementInterface[]>([])
    useEffect(function() {
        (async function() {
            //query announcment api and store it in announcements
            let api = new API("/api/announcements", "get")
            let req = await api.query({})
            if (req.success) {
                setAnnouncements(req.payload)
            }
        })()
    },[])
    return (
        <Background title = "Announcements"
            sub = "Family Football Pick'em">
            <div className = "hp-page">
                <div className = "announcements">
                    {announcements.map(announcement => (<Announcement key = {announcement.timestamp} {...announcement} />))}
                    {announcements.length === 0 &&
                        <div className = "hp-empty">Nothing To Report</div>
                    }
                </div>
            </div>
        </Background>
    )
}
