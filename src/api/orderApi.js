import apiClient from './apiClient';

const orderAPI = {
    getAll(pageNumber = 1, pageSize = 10) {
        const url = `/orders/paginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return apiClient.get(url);
    },
    getOrdersById(id) {
        const url = `/orders/${id}`;
        return apiClient.get(url);
    },

}

export default orderAPI;