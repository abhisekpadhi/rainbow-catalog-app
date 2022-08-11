import {IFarm} from '../common/redux/farm-reducer';

export interface IInventoryResp {
    productName: string;
    packSize: string;
    productDescription: string;
    imageUrl: string;
    grading: string;
    variant: string;
    perishability: string;
    logisticsNeed: string;
    coldChain: string;
    idealDelTat: string;
    skuId: string;
    qty: number;
    priceInPaise: number;
    itemId: string;
}

export enum InventoryOp {
    add = 'add',
    remove = 'remove',
    price = 'price',
}
export interface IInventoryLedger {
    farmId: number;
    productId: string;
    qty: number;
    op: InventoryOp;
    opening: number;
    createdAt: number;
    itemId: string;
}

export interface IInventoryUpdateRequest {
    op: InventoryOp;
    farmId: number;
    priceInPaise: number;
    productId: string;
    qty: number;
    itemId: string;
}

export interface IInventoryPricingUpdateRequest {
    priceInPaise: number;
    itemId: string;
}

export interface IProductCatalog {
    productName: string;
    packSize: string;
    productDescription: string;
    imageUrl: string;
    grading: string;
    variant: string;
    perishability: string;
    logisticsNeed: string;
    coldChain: string;
    idealDelTat: string;
    skuId: string;
}

export interface IFarmInventoryLedgerResp extends IInventoryLedger {
    product: IProductCatalog;
}

export enum OrderStatus {
    active = 'Active',
    created = 'Created',
    rts='Packed',
    shipped='Shipped',
    ofd='Out for Delivery',
    delivered = 'Delivered',
    cancelled = 'Cancelled',
    rtoi = 'RTO initiated',
    rtod = 'RTO delivered',
}

export interface ISellerOrderResponse {
    sellerOrderId: string;
    createdAt: number;
    status: string;
    deliveryAddress: string;
    customer: string;
    customerNote: string;
    itemList: {itemName: string, qty: number; picUrl: string}[];
}

export interface ISellerOrderStatusUpdateRequest {
    orderId: string;
    status: OrderStatus;
}

export interface IGenericMessageResp {
    data: {message: string};
    errors: null | any;
}

export interface BaseResp {
    errors?: null | any;
}

export interface ILoginResp extends BaseResp {
    data: {
        farmer: { id: number; phone: string; farmerName: string; };
        jwt: string;
    };
}

export interface IGetInventoryResp {
    data: {
        inventory: IInventoryResp[];
    };
}

export interface IGetLedgerResp {
    data: {
        ledger: IFarmInventoryLedgerResp[];
    };
}

export interface IGetFarmsResp extends BaseResp {
    data: {
        farms: IFarm[];
    };
}

export interface IUpdateFarmResp extends BaseResp {
    data: {
        farm: IFarm;
    };
}

export interface IGetSellerOrdersResp extends BaseResp {
    data: {
        orders: ISellerOrderResponse[];
    };
}
