import { ErrorCodeStrings } from "../utils/errorCodeStrings";

export interface Error{
    code:ErrorCodeStrings | string,
    message:string
}

export function instanceOfError(data: any): data is Error {
    if(!data) return false
    return 'message' in data && 'code' in data;
}