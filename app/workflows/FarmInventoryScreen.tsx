import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Image,
    Linking,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IInventoryResp} from './models';
import {getInventory, updateInventoryPricing} from './api';
import {IFarm} from '../common/redux/farm-reducer';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {ProgressIndicator} from '../common/components/ProgressIndicator';

function FarmInventoryScreen() {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'माल सूची',
            headerCenter: () => null,
        });
    }, [navigation]);
    const [inventory, setInventory] = useState<IInventoryResp[]>();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleItem, setVisibleItem] = useState<IInventoryResp | null>(null);
    const [price, setPrice] = useState('');
    const farmStore: IFarm = useSelector((state: any) => state.farmReducer);
    const toast = useToast();
    useEffect(() => {
        if (!visible) {
            setVisibleItem(null);
        }
    }, [visible]);
    useEffect(() => {
        if (visibleItem !== null) {
            setVisible(true);
        }
    }, [visibleItem]);
    useEffect(() => {
        (async () => {
            try {
                const res = await getInventory(farmStore.id);
                setInventory(res.data.inventory);
            } catch (e) {
                toast.show('विवरण लाने में विफल', {
                    type: 'danger',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    const whatsappShare = (item: IInventoryResp) => {
        const msg = `${item.productName} (${item.grading}-${item.variant}) ${item.packSize} ₹${item.priceInPaise/100}\nनाश: ${item.perishability}, यातायात: ${item.logisticsNeed}\nठंडी सांकल: ${item.coldChain}, वितरण विलम्ब: ${item.idealDelTat}`;
        let url = 'whatsapp://send?text=' + msg;
        Linking.openURL(url)
            .then(_ => {

            })
            .catch(() => {
                toast.show('सुनिश्चित करें कि आपके डिवाइस पर व्हाट्सएप है', { type: 'warning'});
            });
    };
    const handlePriceUpdate = async () => {
        if (visibleItem === null) {
            toast.show('बाद में पुन: प्रयास', {type: 'warning'});
        }
        setProgress(true);
        const newPrice = parseInt(price, 10) * 100;
        try {
            const payload = {
                itemId: visibleItem!.itemId,
                priceInPaise: newPrice,
            };
            const res = await updateInventoryPricing(payload);
            if (res.data.message === 'ok') {
                toast.show('सफल', { type: 'success'});
                if (inventory) {
                    const idx = inventory.findIndex(o => o.itemId === visibleItem!.itemId);
                    if (idx !== -1) {
                        const updated = [...inventory];
                        updated[idx] = {
                            ...updated[idx],
                            priceInPaise: newPrice,
                        };
                        setInventory(updated);
                        setVisible(false);
                    }
                }
            } else {
                toast.show('विफल', {
                    type: 'danger',
                });
            }
        } catch (e) {
            toast.show('विफल, बाद में पुन: प्रयास', {
                type: 'danger',
            });
        } finally {
            setProgress(false);
        }
        setVisible(false);
    };
    const priceChangeModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                setVisible(false);
            }}>
            <View
                style={[
                    {flex: 1, alignItems: 'center', justifyContent: 'center'},
                    visible ? {backgroundColor: 'rgba(0,0,0,0.8)'} : {},
                ]}>
                <View
                    style={{
                        backgroundColor: 'ivory',
                        borderRadius: 20,
                        height: 320,
                        width: 320,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <TextInput
                        autoFocus={true}
                        value={price}
                        onChangeText={setPrice}
                        placeholder={'उदाहरण के लिए - 224'}
                        style={{
                            textAlign: 'center',
                            paddingLeft: 10,
                            letterSpacing: 1,
                            fontSize: 20,
                            color: '#000',
                            backgroundColor: 'white',
                            elevation: 2,
                            borderWidth: 1,
                            borderRadius: 6,
                            borderColor: '#e1e1e1',
                            width: 220,
                        }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            if (!progress) {
                                handlePriceUpdate().then(_ => {});
                            }
                        }}
                        disabled={progress}
                        style={{
                            marginTop: 20,
                            backgroundColor: '#ffd0af',
                            paddingVertical: 8,
                            alignItems: 'center',
                            marginHorizontal: 16,
                            borderRadius: 6,
                            elevation: 2,
                            width: 220,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#e56200',
                            }}>
                            नया भाव पुष्टि करें
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setVisible(false);
                    }}
                    style={{
                        marginTop: 20,
                        backgroundColor: '#fff',
                        paddingVertical: 8,
                        alignItems: 'center',
                        marginHorizontal: 16,
                        borderRadius: 6,
                        elevation: 2,
                        width: 220,
                    }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#000',
                        }}>
                        कोई परिवर्तन नहीं
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
    const renderSku = (item: IInventoryResp) => {
        return (
            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#e1e1e1',
                    paddingTop: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Image
                            source={{
                                uri: item.imageUrl,
                            }}
                            style={{width: 58, height: 58, resizeMode: 'cover'}}
                        />
                    </View>
                    <View style={{flex: 5}}>
                        <Text style={{fontWeight: 'bold', color: '#000'}}>
                            {item.productName} - ₹{item.priceInPaise/100}
                        </Text>
                        <Text style={{fontSize: 12, marginBottom: 4}}>
                            {item.variant}
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingRight: 6,
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 12, paddingRight: 4}}>
                                    {item.packSize}
                                </Text>
                            </View>
                            <View style={{flex: 1.8}}>
                                <Text style={{fontSize: 12, paddingLeft: 4}}>
                                    श्रेणी: {item.grading}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 12, paddingRight: 4}}>
                                    नाश: {item.perishability}
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 12, paddingLeft: 4}}>
                                    यातायात: {item.logisticsNeed}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 12, paddingRight: 4}}>
                                    ठंडी सांकल: {item.coldChain}
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 12, paddingLeft: 4}}>
                                    वितरण विलम्ब: {item.idealDelTat}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{textAlign: 'center'}}>{item.qty}</Text>
                    </View>
                    <View style={{flex: 2}}>
                        <Text style={{textAlign: 'center'}}>
                            {item.perishability}
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                    <TouchableOpacity
                        onPress={() => {
                            setVisibleItem(item);
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: '#ffd0af',
                            paddingVertical: 8,
                            alignItems: 'center',
                            marginHorizontal: 16,
                            borderRadius: 6,
                            elevation: 2,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#e56200',
                            }}>
                            भाव बदलें
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            whatsappShare(item);
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: '#adffbd',
                            paddingVertical: 8,
                            alignItems: 'center',
                            marginHorizontal: 16,
                            borderRadius: 6,
                            elevation: 2,
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#189f31',
                            }}>
                            शेयर करेंं
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const header = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e1e1e1',
                    paddingVertical: 10,
                }}>
                <View style={{flex: 2, alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                        तस्वीर
                    </Text>
                </View>
                <View style={{flex: 5}}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                        विवरण
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'center',
                        }}>
                        मात्रा
                    </Text>
                </View>
                <View style={{flex: 2}}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'black',
                            textAlign: 'center',
                        }}>
                        नाश
                    </Text>
                </View>
            </View>
        );
    };
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
    const dataForFlatlist = () => {
        if (inventory === undefined) {
            return [];
        }
        return inventory.map(item => ({
            key: item.skuId,
            content: renderSku(item),
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
            {priceChangeModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'ivory',
    },
});

export default FarmInventoryScreen;
