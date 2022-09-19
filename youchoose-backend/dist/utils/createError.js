"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfError = exports.CreateError = void 0;
const CreateError = (error) => {
    return {
        success: false,
        message: error.message,
        name: error.name
    };
};
exports.CreateError = CreateError;
function instanceOfError(data) {
    if (typeof data !== 'object')
        return false;
    return 'success' in data && 'message' in data;
}
exports.instanceOfError = instanceOfError;
//# sourceMappingURL=createError.js.map