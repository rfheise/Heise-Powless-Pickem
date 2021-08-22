import {Request} from "./Exports"



export default class API {
    route:string;
    method:string;
    apiRoute = "http://127.0.0.1:8000"
    constructor(route:string, method:any) {
        this.route = route;
        this.method = method;
    }
    //queries api with key value pairs from data
    async query(data:any):Promise<Request> {
        let dataForm = new FormData();
        let keys = Object.keys(data)
        for(let i = 0; i < keys.length; i++) {
            dataForm.append(keys[i],data[keys[i]]);
        } 
        let payload:Request = {success:false, payload:"An Error Occured"};
        try {
            let req = await fetch(this.generateRoute(), {body:dataForm, method:this.method})
            payload = await req.json();
        } catch {
            return {success:false, payload:"An Error Occured"}
        }
        return payload;
    }
    generateRoute() {
        return `${this.apiRoute}${this.route}`
    }
}