export const CreateError = (error:Error) => {
    console.error(error)
    return {
        success:false,
        message:error.message,
        name:error.name
    }
}

export function instanceOfError(data: any): data is Error {
    if(typeof data !== 'object') return false
    return 'success' in data && 'message' in data;
}