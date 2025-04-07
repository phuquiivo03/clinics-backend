export interface IConsultationServiceRequest {
    name: string;
    description: string;
    duration: number; // Duration in minutes
    room: string; // Room ID
    doctor: string; // Doctor ID
    price: number;
}