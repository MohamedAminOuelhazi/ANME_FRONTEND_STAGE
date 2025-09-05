import { user } from "./user.model";

export interface ReunionRequestDTO {
    sujet: string;
    description: string;
    dateProposee: Date;
    validateurIds: number[];   // liste des IDs
    participantIds: number[];  // liste des IDs
}
