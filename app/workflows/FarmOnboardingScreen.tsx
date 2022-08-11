import React, {useEffect, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ProgressIndicator} from '../common/components/ProgressIndicator';
import {updateFarms} from './api';
import {IFarm} from '../common/redux/farm-reducer';
import {IFarmer} from '../common/redux/farmer-reducer';
import {useDispatch, useSelector} from 'react-redux';
import * as Location from 'expo-location';
import {useToast} from 'react-native-toast-notifications';
import {addFarm} from '../common/redux/actions';

function FarmOnboardingScreen(props: {onSuccess: () => void}) {
    const [phone, setPhone] = useState('');
    const [farmName, setFarmName] = useState('');
    const [email, setEmail] = useState('');
    const [progress, setProgress] = useState(false);
    const [location, setLocation] = useState('');
    const farmer: IFarmer = useSelector((state: any) => state.farmerReducer);
    const toast = useToast();
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                toast.show('Permission to access location was denied', { type: 'warning', placement: 'bottom'});
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
        })();
    }, []);
    const handleFarmOnboarding = async () => {
        if (location.length === 0) {
            toast.show('स्थान अनुमति की आवश्यकता है');
            return;
        }
        if (farmName.length > 0 && phone.length > 0 && location.length > 0) {
            setProgress(true);
            const payload: IFarm = {
                id: 0,
                farmerId: farmer.id,
                farmName: farmName,
                farmLocation: location,
                providerId: '',
                supportPhone: phone,
                supportEmail: email,
                rating: 0,
                extraData: '',
            };
            const res = await updateFarms(payload);
            if (res.data.farm) {
                dispatch(addFarm(res.data.farm));
                setProgress(false);
                toast.show('सफल', { type: 'success', placement: 'bottom'});
                props.onSuccess();
                return;
            } else {
                setProgress(false);
                toast.show(
                    'गोदाम को अपडेट करने में विफल, कृपया बाद में पुन: प्रयास करें',
                    {type: 'danger', placement: 'bottom'},
                );
            }
        } else {
            toast.show('गोदाम का नाम और फोन नंबर आवश्यक है', { type: 'warning', placement: 'bottom'});
        }
    };
    return (
        <View style={{flex: 1, backgroundColor: 'ivory', padding: 20}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: 'black'}}>
                अपना गोदाम जोड़ें
            </Text>
            <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 8}}>
                गोदाम का नाम
            </Text>
            <TextInput
                value={farmName}
                onChangeText={setFarmName}
                placeholder={'उदाहरण के लिए - चिंटू का गोदाम'}
                style={{
                    paddingLeft: 10,
                    letterSpacing: 1,
                    fontSize: 20,
                    color: '#000',
                    backgroundColor: 'white',
                    elevation: 2,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: '#e1e1e1',
                }}
            />
            <Text style={{fontSize: 18, paddingTop: 20, paddingBottom: 8,}}>
                अपने गोदाम का मोबाइल नंबर
            </Text>
            <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType={'phone-pad'}
                placeholder={'उदाहरण के लिए - 9876543210'}
                style={{
                    paddingLeft: 10,
                    letterSpacing: 1,
                    fontSize: 20,
                    color: '#000',
                    backgroundColor: 'white',
                    elevation: 2,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: '#e1e1e1',
                }}
            />
            <Text style={{fontSize: 18, paddingTop: 20, paddingBottom: 8,}}>
                अपने गोदाम का ईमेल (छोड़ सकते हैं)
            </Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType={'email-address'}
                placeholder={'उदाहरण के लिए chintugodo@gmail.com'}
                style={{
                    marginTop: 12,
                    paddingLeft: 10,
                    letterSpacing: 1,
                    fontSize: 20,
                    color: '#000',
                    backgroundColor: 'white',
                    elevation: 2,
                    borderWidth: 1,
                    borderRadius: 6,
                    borderColor: '#e1e1e1',
                }}
            />
            <View style={{ paddingVertical: 20}}>
                <TouchableOpacity
                    onPress={() => {
                        if (!progress) {
                            handleFarmOnboarding().then(_ => {});
                        }
                    }}
                    disabled={progress}
                    style={{
                        backgroundColor: 'coral',
                        paddingVertical: 12,
                        alignItems: 'center',
                        marginRight: 16,
                        borderRadius: 6,
                        elevation: 6,
                        width: '100%',
                    }}>
                    {progress ? (
                        <ProgressIndicator />
                    ) : (
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#000',
                            }}>
                            आगे बढ़े
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FarmOnboardingScreen;
