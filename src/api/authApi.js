import apiClient from './apiClient';

const authAPI = {
    login(data) {
        const url = `/auth/firebase-login`;
        return apiClient.post(url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};

export default authAPI;
