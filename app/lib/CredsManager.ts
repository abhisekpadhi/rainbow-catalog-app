import store from '../common/redux/store';
import {CredentialsState} from '../common/redux/credentialsReducer';
import dayjs from 'dayjs';
import DeviceInfo from 'react-native-device-info';
import {addCreds, removeCreds} from '../common/redux/actions';
import {GlobalEventEmitter} from '../common/events/emitter';
import {EventTypes} from '../common/events/types';
import {API_URL} from './endpoints';

export const AUTH_API_URL = API_URL + '/auth';

const renewToken = async (request: any) => {
    const resp = await fetch(AUTH_API_URL + '/renew', {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {'Content-Type': 'application/json'},
    });
    return (await resp.json()) as UserAccountLoginWithTokenResponse;
};

export const logout = () => {
    // Notification.showAlert(
    //     "You have been logged out because you were inactive for a long time. Don't worry you can login again.",
    // );
    GlobalEventEmitter.emit(EventTypes.LOGOUT);
};

export interface UserAccountLoginWithTokenResponse {
    accessToken: string;
    onboardingStatus: any;
    refreshToken: string;
    tokenValid: string;
    userAccount: any;
}

class CredsManager {
    private ACCESS_TOKEN_RENEW_CUTOFF_MS = 5 * 60 * 1000; // 5 minutes
    private REFRESH_TOKEN_RENEW_CUTOFF_MS = 24 * 60 * 60 * 1000; // 1 day
    // private ACCESS_TOKEN_EXP_MS = 6 * 60 * 60 * 1000; // 6 hour
    // private REFRESH_TOKEN_EXP_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
    private ACCESS_TOKEN_EXP_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
    private REFRESH_TOKEN_EXP_MS = 180 * 24 * 60 * 60 * 1000; // 180 days
    private TIMER_ACCESS_TOKEN_RENEW: any;
    private TIMER_REFRESH_TOKEN_RENEW: any;

    // checks if credentials need renewal
    areCredentialsExpired(): Boolean {
        // console.log(`refreshToken: ${JSON.stringify(store.getState().credentialsReducer)}`);
        if (
            store.getState().credentialsReducer.accessToken.length === 0 ||
            store.getState().credentialsReducer.refreshToken.length === 0
        ) {
            logout();
        }

        // time between now and last saved token time
        const accessTokenDiff =
            dayjs().valueOf() -
            store.getState().credentialsReducer.accessTokenUpdatedAtMs;

        // const refreshTokenDiff =
        //     dayjs().valueOf() -
        //     store.getState().credentialsReducer.refreshTokenUpdatedAtMs;

        // // refresh token expired - logout
        // if (refreshTokenDiff >= this.REFRESH_TOKEN_EXP_MS) {
        //     console.log('[credsManager] refresh token expired, logout');
        //     logout();
        //     return true;
        // }

        // access token expired
        if (accessTokenDiff > this.ACCESS_TOKEN_EXP_MS) {
            console.log('[credsManager] access token expired, should renew');
            return true;
        }

        // access token is nearing expiry
        if (
            this.ACCESS_TOKEN_EXP_MS - accessTokenDiff <=
            this.ACCESS_TOKEN_RENEW_CUTOFF_MS
        ) {
            console.log(
                '[credsManager] access token nearing expiry, should renew',
            );
            return true;
        }

        // // refresh token is nearing expiry
        // if (
        //     this.REFRESH_TOKEN_EXP_MS - refreshTokenDiff <=
        //     this.REFRESH_TOKEN_RENEW_CUTOFF_MS
        // ) {
        //     console.log(
        //         '[credsManager] refresh token nearing expiry, should renew',
        //     );
        //     return true;
        // }

        // none of the token are nearing expiry
        console.log('[credsManager] token renew not required');
        return false;
    }

    // Renew credentials, persist to redux & start timers to renew
    async renewAndSaveCredentials() {
        const {accessToken, refreshToken} = store.getState().credentialsReducer;
        // console.log(`renewAndSaveCreds: at: ${accessToken}`);
        if (accessToken.length === 0 || refreshToken.length === 0) {
            logout();
            return false;
        }
        try {
            const data = await renewToken({
                accessToken,
                refreshToken,
                deviceId: DeviceInfo.getUniqueId(),
                metadata: '',
            });
            if (!data.tokenValid) {
                console.log(
                    'renewAndSaveCreds: api response invalid token, logout',
                );
                logout();
                return;
            } else {
                const accessTokenUpdatedAtMs =
                    accessToken !== data.accessToken
                        ? dayjs().valueOf()
                        : (store.getState().credentialsReducer
                              .accessTokenUpdatedAtMs as number);
                const refreshTokenUpdatedAtMs =
                    refreshToken !== data.refreshToken
                        ? dayjs().valueOf()
                        : store.getState().credentialsReducer
                              .refreshTokenUpdatedAtMs;
                this.saveCredentials(
                    data.accessToken,
                    data.refreshToken,
                    accessTokenUpdatedAtMs,
                    refreshTokenUpdatedAtMs,
                );
                this.startTimerToRenew(
                    accessTokenUpdatedAtMs,
                    refreshTokenUpdatedAtMs,
                );
            }
            console.log('renewAndSaveCredentials over...');
            return true;
        } catch (e) {
            console.log(`renew credentials error: ${e}`);
            logout();
            return false;
        }
    }

    // persist credentials to redux store
    saveCredentials(
        accessToken: string,
        refreshToken: string,
        accessTokenUpdatedAtMs: number,
        refreshTokenUpdatedAtMs: number,
    ) {
        console.log(`saving creds...`);
        // Redux dispatch call to persist tokens:-
        // This is synchronous call (https://redux.js.org/api/store#dispatchaction)
        store.dispatch(
            addCreds({
                accessToken,
                refreshToken,
                accessTokenUpdatedAtMs,
                refreshTokenUpdatedAtMs,
            } as CredentialsState),
        );
    }

    // start timers for token renewal
    startTimerToRenew(
        accessTokenUpdatedAtMs: number,
        refreshTokenUpdatedAtMs: number,
    ) {
        this.clearTimers();
        const scheduleAfterMsAccessToken =
            accessTokenUpdatedAtMs +
            this.ACCESS_TOKEN_EXP_MS -
            dayjs().valueOf() -
            this.ACCESS_TOKEN_RENEW_CUTOFF_MS;

        this.TIMER_ACCESS_TOKEN_RENEW = setTimeout(
            this.renewAndSaveCredentials,
            scheduleAfterMsAccessToken,
        );
        console.log(
            'Timer set to renew access token after (ms): ' +
                scheduleAfterMsAccessToken,
        );

        const scheduleAfterMsRefreshToken =
            refreshTokenUpdatedAtMs +
            this.REFRESH_TOKEN_EXP_MS -
            dayjs().valueOf() -
            this.REFRESH_TOKEN_RENEW_CUTOFF_MS;

        this.TIMER_REFRESH_TOKEN_RENEW = setTimeout(
            this.renewAndSaveCredentials,
            scheduleAfterMsRefreshToken,
        );

        console.log(
            'Timer set to renew refresh token after (ms): ' +
                scheduleAfterMsRefreshToken,
        );
    }

    // clears credentials from redux store and resets timer
    clearCredentials() {
        store.dispatch(removeCreds());
        this.clearTimers();
    }

    // resets timers
    clearTimers() {
        if (this.TIMER_ACCESS_TOKEN_RENEW) {
            clearTimeout(this.TIMER_ACCESS_TOKEN_RENEW);
        }

        if (this.TIMER_REFRESH_TOKEN_RENEW) {
            clearTimeout(this.TIMER_REFRESH_TOKEN_RENEW);
        }
    }
}

export const authManager = new CredsManager();
