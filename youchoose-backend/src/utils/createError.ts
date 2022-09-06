export const CreateError = (error:Error) => {
    return {
        success:false,
        message:error.message,
        name:error.name
    }
}

