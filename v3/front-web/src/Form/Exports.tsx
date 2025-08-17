import TextExport from "./Inputs/Text"
import InputExport from "./Inputs/Input"
import FormExport from './Form'
import FormAttributeExport from './FormAttribute'
import APIExport from './API'
import PasswordExport from "./Inputs/Password"
import ImageExport from './Inputs/Image'
export const Text = TextExport;
export const Input = InputExport;
export const Form = FormExport;
export const FormAttribute = FormAttributeExport;
export const API = APIExport;
export const Password = PasswordExport;
export const Image = ImageExport;
export interface IFormAttribute {
    name:string,
    title:string,
    component:any,
    value?:any,
    id?:number,
    update?:any,
    copyConstructor(attribute:IFormAttribute):IFormAttribute,

}
export interface IAPI {
    route:string,
    method:string,
}
export interface Request{
    success:boolean,
    payload:any
}