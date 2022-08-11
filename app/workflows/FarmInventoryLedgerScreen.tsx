import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IFarmInventoryLedgerResp, InventoryOp} from './models';
import {getLedger} from './api';
import {IFarm} from '../common/redux/farm-reducer';
import {useSelector} from 'react-redux';
import {ProgressIndicator} from '../common/components/ProgressIndicator';
import dayjs from 'dayjs';

function FarmInventoryLedgerScreen() {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'खाता बही',
            headerCenter: () => null,
        });
    }, [navigation]);
    const [ledger, setLedger] = useState<IFarmInventoryLedgerResp[]>();
    const [loading, setLoading] = useState(true);
    const farmStore: IFarm = useSelector((state: any) => state.farmReducer);
    useEffect(() => {
        (async () => {
            try {
                const resp = await getLedger(farmStore.id);
                setLedger(resp.data.ledger);
            } finally {
                setLoading(false);
            }
        })();
    },[]);
    if (loading) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ProgressIndicator />
            </View>
        );
    }
    //@ts-ignore
    const ledgerEntry = (item: IFarmInventoryLedgerResp) => {
        const {productName, variant, packSize, grading} = item.product;
        const {opening, qty, op, createdAt} = item;
        const getIcon = () => {
            switch (op) {
                case InventoryOp.add:
                    return (
                        <Image
                            source={require('../img/in.png')}
                            style={{ width: 14, height: 14, resizeMode: 'contain'}}
                        />
                    );
                case InventoryOp.remove:
                    return (
                        <Image
                            source={require('../img/out.png')}
                            style={{ width: 14, height: 14, resizeMode: 'contain'}}
                        />
                    );
                default:
                    return <></>
            }
        }
        return (
            <View style={{borderBottomWidth: 1, borderBottomColor: '#e1e1e1', paddingTop: 10}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Text>{dayjs(createdAt).format('D MMM')}</Text>
                        <Text>{dayjs(createdAt).format('hh:mm a')}</Text>
                    </View>
                    <View style={{ flex: 5,}}>
                        <Text style={{fontWeight: 'bold', color: '#000'}}>{productName}</Text>
                        <Text style={{fontSize: 12, marginBottom: 4}}>{variant}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 6}}>
                            <View style={{ flex: 1}}>
                                <Text style={{fontSize: 12, paddingRight: 4}}>{packSize}</Text>
                            </View>
                            <View style={{ flex: 1.8}}>
                                <Text style={{fontSize: 12, paddingLeft: 4}}>
                                    Grade: {grading}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{textAlign: 'center'}}>{qty}</Text>
                    </View>
                    <View style={{ flex: 1,}}>
                        {getIcon()}
                    </View>
                    <View style={{ flex: 1,}}>
                        <Text style={{textAlign: 'center'}}>{opening}</Text>
                    </View>
                </View>
            </View>
        );
    };
    const header = () => {
        return (
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e1e1e1', paddingVertical: 10}}>
                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text>Time</Text>
                </View>
                <View style={{ flex: 5,}}>
                    <Text>Details</Text>
                </View>
                <View style={{flex: 1,}}>
                    <Text>qty</Text>
                </View>
                <View style={{flex: 1,}}>
                    <Text>op</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center'}}>
                    <Text>open</Text>
                </View>
            </View>
        );
    };
    const dataForFlatlist = () => {
        if (ledger === undefined) {
            return [];
        }
        return ledger.map(item => ({
            key: item.productId,
            content: ledgerEntry(item),
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
            {header()}
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
        flex: 1,
        backgroundColor: 'ivory',
    },
});

export default FarmInventoryLedgerScreen;
