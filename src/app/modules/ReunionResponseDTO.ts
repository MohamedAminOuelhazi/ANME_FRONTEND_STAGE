import { user } from "./user.model";

export interface ReunionResponseDTO {
    id: number;
    sujet: string;
    description: string;
    dateProposee: Date; // ou Date
    status: string;
    createur: user;
    validateur: user;
    participants: user[];
    documents: string[];
}