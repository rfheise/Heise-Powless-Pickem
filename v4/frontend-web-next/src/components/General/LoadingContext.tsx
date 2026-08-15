"use client";

import React from "react";

//the `any` belongs on the generic, not the variable - annotating the variable
//as `any` erases Context<T> and makes useContext() infer `unknown`
export const LoadingContext = React.createContext<any>(null);
