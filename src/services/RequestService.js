import QueryString from 'qs';
import MangaDex from '../api/MangaDex';

export async function createRequest(endpoint, params) {
    const response = await MangaDex.get(endpoint, {
        params: params,
        paramsSerializer: params => {
            return QueryString.stringify(params);
        }
    });

    return response.data.data;
}

export function findIDByType(object, type) {
    const target = object.find(value => value.type == type);
    return target?.id || null;
}

export async function requestBaseURL(chapterID) {
    const response = await MangaDex.get("/at-home/server/" + chapterID);
    const baseURL = response.data.baseUrl;
    return baseURL;
}