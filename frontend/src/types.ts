export interface User { id:string; _id?:string; name:string; email:string; role:"customer"|"admin"; isActive?:boolean; }
export interface Pet { _id:string; name:string; type:string; breed:string; age:number; notes?:string; owner?:{name:string;email:string}; }
export interface Service { _id:string; name:string; description:string; price:number; duration:number; }
export interface Appointment { _id:string; pet:Pet; service:Service; date:string; time:string; status:string; reason?:string; customer?:{name:string;email:string}; }
export interface Product { _id:string; name:string; description:string; category:string; price:number; stock:number; active:boolean; }
export interface Order { _id:string; total:number; status:string; items:{name:string;quantity:number;unitPrice:number}[]; }
