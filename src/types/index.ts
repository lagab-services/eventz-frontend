export interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export type TFunction = (key: string) => string;