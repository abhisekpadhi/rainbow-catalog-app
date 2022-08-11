import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getFarms} from './api';
import {IFarmer} from '../common/redux/farmer-reducer';
import {addFarm} from '../common/redux/actions';
import FarmOnboardingScreen from './FarmOnboardingScreen';
import {IFarm} from '../common/redux/farm-reducer';
import {useToast} from 'react-native-toast-notifications';

function HomeScreen() {
    const navigation = useNavigation<any>();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerCenter: () => null,
        });
    }, [navigation]);
    const farmerStore: IFarmer = useSelector((state: any) => state.farmerReducer);
    const farmStore: IFarm = useSelector((state: any) => state.farmReducer);
    const [loadHome, setLoadHome] = useState(false);
    const [needToAddFarm, setNeedToAddFarm] = useState(false);
    useEffect(() => {
        (async () => {
            const farms = await getFarms(farmerStore.id);
            if (farms.data.farms.length > 0) {
                addFarm(farms.data.farms[0]);
                setLoadHome(true);
            } else {
                setNeedToAddFarm(true);
            }
        })();
    }, [farmerStore]);
    const getOrderOps = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.title}>ऑर्डर का प्रबंधन</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('NewOrderScreen')} style={[styles.btn, {backgroundColor: 'plum'}]}>
                        <Image source={require('../img/newOrders.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, {color: 'rebeccapurple'}]}>
                            नए ऑर्डर
                        </Text>
                        <View style={{ width: 10, height: 10, position: 'absolute', right: -4, top: -4, backgroundColor: 'crimson', borderRadius: 100, elevation: 6}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AllOrderScreen', {inward: true})} style={[styles.btn, {backgroundColor: 'cyan'}]}>
                        <Image source={require('../img/allOrders.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, { color: 'darkcyan'}]}>
                            सभी ऑर्डर
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const getInventoryOp = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.title}>गोदाम संचालन</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('ScanOpScreen', {inward: true})} style={[styles.btn, styles.inwardBtn]}>
                        <Image source={require('../img/in.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, { color: 'green'}]}>
                            माल अंदर
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ScanOpScreen')} style={[styles.btn, styles.outwardBtn]}>
                        <Text style={[styles.btnText, {color: 'red'}]}>
                            माल बाहर
                        </Text>
                        <Image source={require('../img/out.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 8}} />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginTop: 16}}>
                    <TouchableOpacity onPress={() => navigation.navigate('ScanOpScreen')} style={[styles.btn, { backgroundColor: '#fff0b1'}]}>
                        <Text style={[styles.btnText, {color: '#766407'}]}>
                            माल खराब
                        </Text>
                        <Image source={require('../img/bin.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: 8}} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    const getInventoryReports = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.title}>गोदाम विवरण</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('FarmInventoryScreen')} style={[styles.btn, { backgroundColor: '#ffb9e6'}]}>
                        <Image source={require('../img/snapshot.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, { color: '#E1319B'}]}>
                            माल सूची
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FarmInventoryLedgerScreen')} style={[styles.btn, { backgroundColor: '#b3d3ff'}]}>
                        <Image source={require('../img/ledger.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, {color: '#2A6CCE'}]}>
                            खाता बही
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const toast = useToast();
    const whatsappShare = () => {
        const farmName = farmStore.farmName;
        const msg = `${farmName} के दुकान से जुडिये और टमाटर केला और आदि वस्तु खरिदिये, लिंक पे क्लिक करें - https://dhoomnow.com/farmers/${farmStore.providerId}/`;
        let url =
            'whatsapp://send?text=' + msg;
        Linking.openURL(url)
            .then((_) => {
                // console.log('WhatsApp Opened');
            })
            .catch(() => {
                toast.show('सुनिश्चित करें कि आपके मोबाइल में व्हाट्सएप है', {
                    type: 'warning',
                });
            });
    };
    const getProfile = () => {
        return (
            <View style={styles.section}>
                <Text style={styles.title}>लोगों को जोड़ें</Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('MeriDukaanScreen')} style={[styles.btn, { backgroundColor: '#ffe3b9'}]}>
                        <Image source={require('../img/store.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, { color: '#B56C12'}]}>
                            मेरी दुकान
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={whatsappShare} style={[styles.btn, { backgroundColor: '#adffbd'}]}>
                        <Image source={require('../img/whatsapp.png')} style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8}} />
                        <Text style={[styles.btnText, {color: '#189f31'}]}>
                            शेयर करें
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    if (needToAddFarm) {
        return (
            <FarmOnboardingScreen
                onSuccess={() => {
                    setLoadHome(true);
                    setNeedToAddFarm(false);
                }}
            />
        );
    }
    if (!loadHome) {
        return (
            <SafeAreaView style={{ backgroundColor: 'ivory', flex: 1,}}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFF0'} />
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator color={'blue'} size={'large'} />
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView style={{ backgroundColor: 'ivory', flex: 1,}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'#FFFFF0'} />
            <ScrollView>
                <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000', paddingVertical: 2, textAlign: 'center', marginTop: 10}}>
                    🙏 नमस्ते चिंटू जी
                </Text>
                {getOrderOps()}
                {getInventoryOp()}
                {getInventoryReports()}
                {getProfile()}
                <View style={{alignItems: 'center'}}>
                    <Image
                        source={{uri: 'https://i.imgur.com/FP2dzUC.png'}}
                        style={{ width: 120, height: 120, resizeMode: 'contain'}}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    btn: {
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginRight: 12,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inwardBtn: {
        backgroundColor: 'lightgreen',
    },
    outwardBtn: {
        backgroundColor: 'lightpink',
    },
});

export default HomeScreen;
