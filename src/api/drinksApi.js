import apiClient from './apiClient';

const drinksAPI = {
    getAll(pageNumber = 1, pageSize = 10) {
        const url = `/drink/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return apiClient.get(url);
    },
    getDrinksById(id) {
        const url = `/drink/${id}`;
        return apiClient.get(url);
    },

}

export default drinksAPI;