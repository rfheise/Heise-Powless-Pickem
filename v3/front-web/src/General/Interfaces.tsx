

export interface User {
    first_name:string,
    last_name:string,
    propic:string,
    username:string,
    uuid:string,
    win:number,
    loss:number,
    tie:number
}
export interface Week {
    week:number,
    year:number,
    uuid:string,
    week_type:string,
}

export interface Team {
    name:string,
    uuid:string,
    abrv:string,
    banned:boolean,
    bye:Week,
    logo:string
}