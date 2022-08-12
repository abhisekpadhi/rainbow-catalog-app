import {ApiUtils} from '../lib/ApiUtils';
import {API_URL} from '../lib/endpoints';
import {IFarm} from '../common/redux/farm-reducer';
import {
    IGetFarmsResp,
    IGetInventoryResp,
    IGetLedgerResp,
    ILoginResp,
    IGenericMessageResp,
    IUpdateFarmResp,
    IInventoryUpdateRequest,
    OrderStatus, IGetSellerOrdersResp, ISellerOrderStatusUpdateRequest, IInventoryPricingUpdateRequest,
} from './models';

export const requestOtp = (payload: {phone: string}) => {
    return ApiUtils.makePostRequestWithJsonBodyUnsafe<IGenericMessageResp>(
        API_URL + '/otp',
        payload,
    );
};

export const loginWithOtp = (payload: any) => {
    return ApiUtils.makePostRequestWithJsonBodyUnsafe<ILoginResp>(
        API_URL + '/login',
        payload,
    );
};

export const getFarms = (farmerId: number) => {
    return ApiUtils.makeGetRequest<IGetFarmsResp>(
        API_URL + `/farms?farmerId=${farmerId}`,
    );
};

export const updateFarms = (payload: IFarm) => {
    return ApiUtils.makePostRequestWithJsonBody<IUpdateFarmResp>(
        API_URL + '/farms/update',
        payload,
    );
};

export const getInventory = (farmId: number) => {
    const url = API_URL + `/inventory?farmId=${farmId}`;
    return ApiUtils.makeGetRequest<IGetInventoryResp>(
        url,
    );
};

export const getLedger = (farmId: number) => {
    const url = API_URL + `/inventory/ledger?farmId=${farmId}`;
    return ApiUtils.makeGetRequest<IGetLedgerResp>(
        url,
    );
};

export const updateInventoryPricing = (
    payload: IInventoryPricingUpdateRequest,
) => {
    const url = API_URL + '/inventory/update/price';
    return ApiUtils.makePostRequestWithJsonBody<IGenericMessageResp>(
        url,
        payload,
    );
};

export const updateInventory = (payload: IInventoryUpdateRequest) => {
    const url = API_URL + '/inventory/update';
    return ApiUtils.makePostRequestWithJsonBody<IGenericMessageResp>(
        url,
        payload,
    );
};

export const getSellerOrders = (providerId: string, status: OrderStatus[]) => {
    let s = '';
    for (const item of status) {
        s += `&status=${encodeURIComponent(item)}`;
    }
    const q = `?providerId=${providerId}` + s;
    const url = API_URL + '/seller/orders' + q;
    console.log(url);
    return ApiUtils.makeGetRequest<IGetSellerOrdersResp>(
        url,
    );
};

export const updateSellerOrderStatus = (
    payload: ISellerOrderStatusUpdateRequest,
) => {
    const url = API_URL + '/seller/orders/status';
    return ApiUtils.makePostRequestWithJsonBody<IGenericMessageResp>(
        url,
        payload,
    );
};
