import React, {useEffect, useState} from 'react'
import Background from '../Background/Background'
import API  from '../Form/API'
import baseball from './background.png'
import Announcement, {AnnouncementInterface} from "./Announcement"
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
        <Background title = "announcements">
            <div className = "announcements">
                {announcements.map(announcement => (<Announcement key = {announcement.timestamp} {...announcement} />))}
            </div>
        </Background>
    )
}