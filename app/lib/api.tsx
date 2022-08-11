import {API_URL} from './endpoints';
import {ApiUtils} from './ApiUtils';

// const FCMTOKEN_API_URL = API_URL + '/api/fcmtokens';
const FCMTOKEN_API_URL = API_URL + 'api/fcm'

export interface updateFCMTokensRequest{
    userId: string;
    token: string;
}

export interface FCMTokensResponse{
    userId: string;
    token: string;
    createdAt: number;
    currentActive: boolean;
}

export const saveFCMToken = (request: updateFCMTokensRequest) => {
    return ApiUtils.makePostRequestWithJsonBody<string>(
        FCMTOKEN_API_URL + '/',
        request,
    );
};

export const getUserFCMToken = (userId: string) => {
    return ApiUtils.makeGetRequest<FCMTokensResponse>(
        FCMTOKEN_API_URL + `${userId}`
    )
}
