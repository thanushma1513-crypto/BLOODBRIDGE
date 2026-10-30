export type BloodGroup = 'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-';
export type View = 'home'|'request'|'donor'|'thalassemia'|'hospitals'|'history'|'camps'|'partners'|'admin';
export interface Donor { id:string; name:string; email?:string; age:number; bloodGroup:BloodGroup; phone:string; lastDonation:string; availability?:'Available'|'Unavailable'; emergencyAlerts:boolean; donationReminders:boolean; thalassemiaAlerts:boolean; verified:boolean; createdAt:string; }
export interface BloodRequest { id:string; requesterName:string; hospital:string; patientName:string; bloodGroup:BloodGroup; patientAge:number; units:number; phone:string; condition:string; description:string; createdAt:string; status:'ACTIVE'|'FULFILLED'; }
export interface ThalassemiaCase { id:string; centre:string; patientRef:string; patientName?:string; patientAge?:number; contact?:string; notes?:string; bloodGroup:BloodGroup; nextTransfusion:string; units:number; verified:boolean; createdAt:string; }
export interface Donation { id:string; donorId:string; date:string; centre:string; units:number; verified:boolean; }
export interface Camp { id:string; title:string; organiser:string; date:string; time:string; venue:string; city:string; contact:string; }
