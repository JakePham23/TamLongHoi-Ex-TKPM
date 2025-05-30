// src/services/BaseService.js
import { API_URL } from "../utils/constants.js";

class BaseService {
    constructor(endpoint) {
        this.API_BASE_URL = `${API_URL}/${endpoint}`;
    }

    async _request(method, path = '', data = null) {
        try {
            const url = `${this.API_BASE_URL}${path}`;
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            // Handle 204 No Content responses
            if (response.status === 204) {
                console.log("Operation successful, no content returned");
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${method} ${path}]:`, error);
            throw error;
        }
    }

    async getAll() {
        return this._request('GET', '/');
    }

    async getById(id) {
        return this._request('GET', `/${id}`);
    }
    async get({data}){
        return this._request('GET', '/getData', data)
    }
    async create(data) {
        console.log("📥 Adding data:", data);
        return this._request('POST', '/add', data);
    }

    async update(id, data) {
        console.log(`✏️ Updating with ID: ${id}, Data:`, data);
        return this._request('PUT', `/update/${id}`, data);
    }

    async delete(id) {
        console.log(`🗑️ Deleting with ID: ${id}`);
        return this._request('DELETE', `/delete/${id}`);
    }
}

export default BaseService;