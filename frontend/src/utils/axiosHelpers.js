import axios from 'axios';

import { InvalidEndpointError } from '../errors';
import { SERVER_URL } from "../constants";

const validateEndpoint = (endpoint) => {
    if (typeof endpoint !== "string") {
        throw new InvalidEndpointError();
    }
}

export async function axiosGet(endpoint, config) {
    validateEndpoint(endpoint);
    return await axios.get(`${SERVER_URL}/${endpoint}`, config);
}

export async function axiosPost(endpoint, data, config) {
    validateEndpoint(endpoint);
    return await axios.post(`${SERVER_URL}/${endpoint}`, data, config);
}

export async function axiosDelete(endpoint, config) {
    validateEndpoint(endpoint);
    return await axios.delete(`${SERVER_URL}/${endpoint}`, config);
}