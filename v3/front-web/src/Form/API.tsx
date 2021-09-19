import {Request} from "./Exports"
import {LoadingContext} from '../App'
import { useContext } from "react";


export default class API {
    route:string;
    method:string;
    static apiRoute = "https://heisepowlesspickem.com"
    static setLoading:any = null;
    // static apiRoute = "http://127.0.0.1:8000";
    constructor(route:string, method:any) {
        this.route = route;
        this.method = method;
    }
    //queries api with key value pairs from data
    //auth determines if it is an authentication route
    //will save token if so
    async query(data:any,auth = false):Promise<Request> {
        API.setLoading(true);
        let dataForm = new FormData();
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++) {
            dataForm.append(keys[i],data[keys[i]]);
        } 
        let payload:Request = {success:false, payload:"An Error Occured"};
        try {
            let req;
            let headers:any = {}
            //get token and add it to headers
            let token = API.getToken()
            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }
            if (this.method == "get") {
                req = await fetch(this.generateRoute(), {method:"get",headers:headers})
            } else {
                req = await fetch(this.generateRoute(), {body:dataForm, headers:headers, method:this.method})
            }
            if (req.status == 401 || req.status == 403) {
                window.localStorage.setItem("token","")
                window.location.href = "/login"
            }
            payload = await req.json();
            //if authentication route
            //save api token
            if (auth && payload.success) {
                window.localStorage.setItem('token', payload.payload['token'])
            }
        } catch {
            API.setLoading(false);
            return {success:false, payload:"An Error Occured"}
        }
        API.setLoading(false);
        return payload;
    }
    generateRoute() {
        return `${API.apiRoute}${this.route}`
    }
    public static getToken() {
        return window.localStorage.getItem("token")
    }
    public static generateLink(link:string) {
        return `${API.apiRoute}${link}`
    }
}