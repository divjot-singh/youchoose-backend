"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateError = void 0;
const CreateError = (error) => {
    return {
        success: false,
        message: error.message,
        name: error.name
    };
};
exports.CreateError = CreateError;
//# sourceMappingURL=createError.js.map