export type Film = {
    _id: string;
    brand: string;
    name: string;
    iso: number;
    formatThirtyFive: boolean;
    formatOneTwenty: boolean;
    color: boolean;
    staticImageUrl: string;
    description: string;
}

export type Project = {
    filmsID: string[];
    name: string;
}