import {User} from '../General/Interfaces'
import React from 'react'
import "./announcement.css"
import API from '../Form/API'
import Propic from '../General/Propic'

export interface AnnouncementInterface {
    user:User,
    announcement:string,
    timestamp:string
}

function Announcement(props:AnnouncementInterface) {
    return (
        <div className = "announcement">
            <div className = "announcement-header">
                <Propic image = {API.generateLink(props.user.propic)}
                    style = {{border:"0px solid black"}}
                    height = "5rem" width = "5rem" />
                <div className = "announcement-header announcement-name">
                <div className = "announcement-header-text">{`${props.user.first_name} ${props.user.last_name}`}</div>
                </div>
                
                <div className = "announcement-header-text">{props.timestamp}</div>
            </div>
            <div className = "announcement-text">
                {props.announcement}
            </div>
        </div>
    )
}

export default React.memo(Announcement)