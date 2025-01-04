// locations.model.ts
export interface Locations {
    id: number;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    users_id: number;
    created_at: string; // ou Date, dependendo de como você quer tratar a data
    updated_at: string; // ou Date
}