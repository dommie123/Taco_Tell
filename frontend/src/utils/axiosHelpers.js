import axios from 'axios';

import { InvalidEndpointError } from '../errors';
import { SERVER_URL } from "../constants";

export async function axiosGet(endpoint, config) {
    if (typeof endpoint !== "string") {
        throw InvalidEndpointError();
    }

    return await axios.get(`${SERVER_URL}/${endpoint}`, config);
}