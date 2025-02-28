import apiClient from './apiClient';

const ingredientsAPI = {
    getAll(pageNumber = 1, pageSize = 10) {
        const url = `/ingredient/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return apiClient.get(url);
    },
    getIngredientById(id) {
        const url = `/ingredient/${id}`;
        return apiClient.get(url);
    },
}

export default ingredientsAPI;