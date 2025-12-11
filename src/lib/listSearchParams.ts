import {createSearchParamsCache, parseAsInteger, parseAsString} from "nuqs/server";
import {getSortingStateParser} from "@/lib/parsers";

export const listSearchParams = createSearchParamsCache({
    page: parseAsInteger.withDefault(1),
    size: parseAsInteger.withDefault(20),
    sort: getSortingStateParser<unknown>(),
    q: parseAsString.withDefault(""),
});
