/**
 * Interface representing a paginated response from the API,
 * similar to Spring Boot's Page<T>.
 */
export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}


export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string;
}


export interface SearchEventsParams {
    keyword?: string;
    page?: number;
    size?: number;
    sort?: string;
}

export interface SearchLinksParams {
    keyword?: string;
    brandName?: string;
    page?: number;
    size?: number;
    sort?: string;
}