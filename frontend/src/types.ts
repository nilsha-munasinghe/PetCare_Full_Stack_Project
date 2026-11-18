export interface User { id: string; _id?: string; name: string; email: string; role: "customer" | "admin"; }
export interface Pet { _id: string; name: string; type: string; breed: string; age: number; notes?: string; }
export interface Service { _id: string; name: string; description: string; price: number; duration: number; }
export interface Appointment { _id: string; pet: Pet; service: Service; date: string; time: string; status: string; reason?: string; customer?: { name: string; email: string }; }
