import api_instance from "../base.api";

const endpoint = 'person/code/';

// Implemented
export const apiVerificationCode = {
    requestVerificationCode : function (id, email) {
        return api_instance.post(`${endpoint}`, {
            id,
            email
        })
    }
}

