import React, {useEffect, useState} from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ISellerOrderResponse, OrderStatus} from './models';
import {ProgressIndicator} from '../common/components/ProgressIndicator';
import {getSellerOrders, updateSellerOrderStatus} from './api';
import {IFarm} from '../common/redux/farm-reducer';
import {useSelector} from 'react-redux';
import store from '../common/redux/store';
import dayjs from 'dayjs';
import {useToast} from 'react-native-toast-notifications';

export const OrderStatusStateTransition = {
    [OrderStatus.active.toString()]: [OrderStatus.created],
    [OrderStatus.created]: [OrderStatus.rts],
    [OrderStatus.rts]: [OrderStatus.shipped],
    [OrderStatus.shipped]: [
        OrderStatus.ofd,
        OrderStatus.delivered,
        OrderStatus.rtoi,
    ],
    [OrderStatus.ofd]: [OrderStatus.delivered, OrderStatus.rtoi],
    [OrderStatus.delivered]: [OrderStatus.rtoi],
    [OrderStatus.rtoi]: [OrderStatus.delivered, OrderStatus.rtod],
};
const isTransitionPossible = (
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
) => {
    console.log('currentStatus', currentStatus);
    console.log('newStatus', newStatus);
    return (
        (OrderStatusStateTransition[currentStatus] as OrderStatus[]).includes(
            newStatus,
        ) || false
    );
};
export default function AllOrderScreen() {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'सभी ऑर्डर',
        });
    });
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(false);
    const [orders, setOrders] = useState<ISellerOrderResponse[]>([]);
    const farmStore: IFarm = useSelector((state: any) => state.farmReducer);
    const toast = useToast();
    useEffect(() => {
        console.log(store.getState());
        (async () => {
            try {
                const res = await getSellerOrders(farmStore.providerId, [
                    OrderStatus.created,
                    OrderStatus.delivered,
                    OrderStatus.shipped,
                    OrderStatus.cancelled,
                    OrderStatus.rts,
                ]);
                console.log('orders', res.data.orders);
                setOrders(res.data.orders);
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <ProgressIndicator />
            </View>
        );
    }
    const handleOrderStatusUpdate = async (
        orderId: string,
        status: OrderStatus,
    ) => {
        setProgress(true);
        try {
            const res = await updateSellerOrderStatus({
                orderId,
                status,
            });
            if (res.data.message === 'ok') {
                toast.show('सफल', {type: 'success', placement: 'bottom'});
                const idx = orders.findIndex(o => o.sellerOrderId === orderId);
                if (idx !== -1) {
                    const updated = [...orders];
                    updated[idx] = {...updated[idx], status};
                    setOrders(updated);
                }
            } else {
                toast.show(res.data.message, {
                    type: 'danger',
                    placement: 'bottom',
                });
            }
        } catch (e) {
            toast.show('विफल, बाद में पुन: प्रयास', {
                type: 'danger',
            });
        } finally {
            setProgress(false);
        }
    };

    const getOrderStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.active:
                return '#ffd341';
            case OrderStatus.cancelled:
                return '#ec0e49';
            case OrderStatus.created:
                return '#4be4ff';
            case OrderStatus.delivered:
                return '#3dd900';
            case OrderStatus.shipped:
                return '#2bbe83';
            case OrderStatus.ofd:
                return '#329f69';
            case OrderStatus.rts:
                return '#2f9aff';
            case OrderStatus.rtoi:
                return '#9345e1';
            case OrderStatus.rtod:
                return '#dc14ca';
            default:
                return '#e1e1e1';
        }
    };
    const orderUnit = (item: ISellerOrderResponse) => {
        const shippable = isTransitionPossible(
            item.status as OrderStatus,
            OrderStatus.shipped,
        );
        const donable = isTransitionPossible(
            item.status as OrderStatus,
            OrderStatus.delivered,
        );
        const packable = isTransitionPossible(
            item.status as OrderStatus,
            OrderStatus.rts,
        );
        console.log(shippable, donable, packable);
        return (
            <View
                style={{
                    borderRadius: 6,
                    elevation: 4,
                    backgroundColor: 'white',
                    marginVertical: 6,
                    marginHorizontal: 10,
                }}>
                <View
                    style={{
                        paddingVertical: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getOrderStatusColor(
                            item.status as OrderStatus,
                        ),
                    }}>
                    <Text
                        style={{
                            color: 'black',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}>
                        Status: {item.status}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                        borderStyle: 'dashed',
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            borderRightWidth: 1,
                            borderStyle: 'dashed',
                            borderRightColor: 'grey',
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}>
                            {item.sellerOrderId}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                            }}>
                            {dayjs(item.createdAt).format(
                                'DD MMM, YY hh:mm: a',
                            )}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                        borderStyle: 'dashed',
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            borderRightWidth: 1,
                            borderStyle: 'dashed',
                            borderRightColor: 'grey',
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>
                            Delivery address
                        </Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}>
                            {item.deliveryAddress}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                                fontWeight: 'bold',
                            }}>
                            Customer
                        </Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                            }}>
                            {item.customer}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: 'grey',
                        borderStyle: 'dashed',
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                    }}>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>
                            Customer note
                        </Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}>
                            {item.customerNote}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                    }}>
                    <View
                        style={{
                            flex: 3,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>
                            Item list
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}>
                            Qty
                        </Text>
                    </View>
                </View>
                {item.itemList.map(o => (
                    <View
                        key={o.itemName}
                        style={{
                            flexDirection: 'row',
                            borderBottomWidth: 1,
                            borderBottomColor: 'grey',
                            borderStyle: 'dashed',
                            paddingVertical: 8,
                            paddingHorizontal: 4,
                        }}>
                        <View
                            style={{
                                flex: 3,
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 12,
                                }}>
                                {o.itemName}
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}>
                                {o.qty}
                            </Text>
                        </View>
                    </View>
                ))}
                <View
                    style={{
                        paddingVertical: 10,
                    }}>
                    {progress ? (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ProgressIndicator />
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 4,
                                paddingBottom: 6,
                            }}>
                            {/*<TouchableOpacity*/}
                            {/*    style={{*/}
                            {/*        paddingVertical: 6,*/}
                            {/*        paddingHorizontal: 8,*/}
                            {/*        backgroundColor: '#FFCC80',*/}
                            {/*        flexDirection: 'row',*/}
                            {/*        alignItems: 'center',*/}
                            {/*        justifyContent: 'center',*/}
                            {/*        borderRadius: 4,*/}
                            {/*        elevation: 4,*/}
                            {/*        marginRight: 10,*/}
                            {/*    }}>*/}
                            {/*    <Image*/}
                            {/*        source={require('../img/invoice.png')}*/}
                            {/*        style={{*/}
                            {/*            width: 16,*/}
                            {/*            height: 16,*/}
                            {/*            resizeMode: 'contain',*/}
                            {/*            marginRight: 4,*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*    <Text*/}
                            {/*        style={{*/}
                            {/*            fontWeight: 'bold',*/}
                            {/*            color: 'black',*/}
                            {/*        }}>*/}
                            {/*        Invoice*/}
                            {/*    </Text>*/}
                            {/*</TouchableOpacity>*/}
                            {packable && (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!progress) {
                                            handleOrderStatusUpdate(
                                                item.sellerOrderId,
                                                OrderStatus.rts,
                                            ).then(_ => {});
                                        }
                                    }}
                                    disabled={progress}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 8,
                                        backgroundColor: '#2f9aff',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        elevation: 4,
                                        marginRight: 10,
                                    }}>
                                    <Image
                                        source={require('../img/packed.png')}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            resizeMode: 'contain',
                                            marginRight: 4,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'black',
                                        }}>
                                        Packed
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {shippable && (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!progress) {
                                            handleOrderStatusUpdate(
                                                item.sellerOrderId,
                                                OrderStatus.shipped,
                                            ).then(_ => {});
                                        }
                                    }}
                                    disabled={progress}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 8,
                                        backgroundColor: '#2bbe83',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        elevation: 4,
                                        marginRight: 10,
                                    }}>
                                    <Image
                                        source={require('../img/shipped.png')}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            resizeMode: 'contain',
                                            marginRight: 4,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'black',
                                        }}>
                                        shipped
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {donable && (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!progress) {
                                            handleOrderStatusUpdate(
                                                item.sellerOrderId,
                                                OrderStatus.delivered,
                                            ).then(_ => {});
                                        }
                                    }}
                                    disabled={progress}
                                    style={{
                                        paddingVertical: 6,
                                        paddingHorizontal: 8,
                                        backgroundColor: '#3dd900',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        elevation: 4,
                                        marginRight: 10,
                                    }}>
                                    <Image
                                        source={require('../img/done.png')}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            resizeMode: 'contain',
                                            marginRight: 4,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'black',
                                        }}>
                                        Done
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        );
    };
    const dataForFlatlist = () => {
        return orders.map(o => ({
            key: o.sellerOrderId,
            content: orderUnit(o),
        }));
    };
    //@ts-ignore
    const renderItem = ({item}) => {
        return item.content;
    };
    //@ts-ignore
    const keyExtractor = item => item.key;
    return (
        <View style={styles.container}>
            <FlatList
                removeClippedSubviews
                maxToRenderPerBatch={12}
                initialNumToRender={12}
                data={dataForFlatlist()}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flex: 1,
        backgroundColor: 'ivory',
    },
});
