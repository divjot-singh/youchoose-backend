import {SelectSearchOption} from 'react-select-search'

function search(q:any, text:any) {
    const searchLength = q.length;
    const textLength = text.length;

    if (searchLength > textLength) {
        return false;
    }

    if (text.indexOf(q) >= 0) {
        return true;
    }

    mainLoop: for (let i = 0, j = 0; i < searchLength; i += 1) {
        const ch = q.charCodeAt(i);

        while (j < textLength) {
            if (text.charCodeAt(j++) === ch) {
                continue mainLoop;
            }
        }

        return false;
    }

    return true;
}

export const fuzzySearchWrapper = (options:SelectSearchOption[]) => {
    return (query:string) =>{
        return fuzzySearch(options, query)
    }
}

export default function fuzzySearch(options:SelectSearchOption[], query:string):SelectSearchOption[] {
    return !query.length
        ? options
        : options.filter((o:any) =>
              search(
                  query.toLowerCase(),
                  `${o.name} ${o.group || ''}`.trim().toLowerCase(),
              ),
          );
}