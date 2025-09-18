import React from 'react';
import { createJsxSpreadAttribute } from 'typescript';
import { IFormAttribute } from './Exports';


export default class FormAttriubte {
    //name of input
    name:string;
    //title of input
    title:string;
    //input component
    component:any;
    //attriubtes value
    value?:any;
    //attributes id
    id?:number;
    update?:any;
    constructor(name:string, title:string, component:any,
        value = "", id = 0, update = null) {
        this.name = name;
        this.title = title;
        this.component = component;
        this.value = value;
        this.id = id;
        this.update = update;
    }
    //converts Form attribute object into json form
    public toJson() {
        return {
            name:this.name,
            value:this.value,
        }
    }
    //json reducer
    public static jsonReducer(accumulator:any, currentValue:FormAttriubte) {
        return {...accumulator, [currentValue.name]:currentValue.value}
    }
    //copy Constructor
    public static copyConstructor(other:FormAttriubte):FormAttriubte {
        let attribute = new FormAttriubte(other.name, other.title, other.component,
            other.value, other.id, other.update);

        return attribute;
    }
}