export interface ElementsArgs {
    tag: string;
    classes?: string[] | (string | string[])[];
    textContent: string;
    callback?: (event?: Event | undefined) => void;
}

export interface Options {
    method: string;
    body?: BodyInit;
    headers?: HeadersInit;
}

export interface Cars {
    name: string;
    color: string;
    id: number;
}

export interface CarCreate {
    name: string;
    color: string;
}

export interface CarsResponse {
    cars: Cars[];
    count: string | null;
}

export interface SuccessRace {
    success: boolean;
    idCar: number;
}

export interface RaceInfo {
    id: number;
    time: number;
    success?: boolean;
}

export interface Winner {
    id: number;
    wins: number;
    time: number;
}

export interface WinnersResponse {
    winners: Winner[];
    count: string | null;
}

export interface EngineInfo {
    velocity: number;
    distance: number;
}

export interface Animation {
    animate: number;
    id: number;
}
