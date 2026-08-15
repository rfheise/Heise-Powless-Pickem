import {User} from '../General/Interfaces'
import React from 'react'
import "./announcement.css"
import API from '../Form/API'

export interface AnnouncementInterface {
    user:User,
    announcement:string,
    timestamp:string
}

function Announcement(props:AnnouncementInterface) {
    return (
        <article className = "announcement">
            <div className = "announcement-header">
                <div className = "announcement-avatar">
                    <img src = {API.generateLink(props.user.propic)}
                        alt = {`${props.user.first_name} ${props.user.last_name}`} />
                </div>
                <div className = "announcement-name">
                    <div className = "announcement-author">
                        {`${props.user.first_name} ${props.user.last_name}`}
                    </div>
                    <div className = "announcement-time">{props.timestamp}</div>
                </div>
            </div>
            <div className = "announcement-text">
                {props.announcement}
            </div>
        </article>
    )
}

export default React.memo(Announcement)
