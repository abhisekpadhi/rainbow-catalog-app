import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {IFarm} from '../common/redux/farm-reducer';
import {getFarms, updateFarms} from './api';
import {IFarmer} from '../common/redux/farmer-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {ProgressIndicator} from '../common/components/ProgressIndicator';
import {addFarm} from '../common/redux/actions';

function MeriDukaanScreen() {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'मेरी दुकान',
            headerCenter: () => null,
        });
    }, [navigation]);
    const [farm, setFarm] = useState<IFarm | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(false);
    const [farmName, setFarmName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const farmer: IFarmer = useSelector((state: any) => state.farmerReducer);
    const toast = useToast();
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                const res = await getFarms(farmer.id);
                if (res.data.farms.length > 0) {
                    setFarm(res.data.farms[0]);
                    setFarmName(res.data.farms[0].farmName);
                    setPhone(res.data.farms[0].supportPhone);
                    setEmail(res.data.farms[0].supportEmail);
                }
            } catch (e) {
                toast.show(
                    'गोदाम विवरण लाने में विफल',
                    {
                    type: 'danger',
                    placement: 'bottom',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    const handleFarmOnboarding = async () => {
        if (farmName.length > 0 && phone.length > 0 && farm) {
            setProgress(true);
            const payload: IFarm = {
                id: farm.id,
                farmerId: farmer.id,
                farmName: farmName,
                farmLocation: farm.farmLocation,
                providerId: farm.providerId,
                supportPhone: phone,
                supportEmail: email,
                rating: farm.rating,
                extraData: farm.extraData,
            };
            const res = await updateFarms(payload);
            if (res.data.farm) {
                dispatch(addFarm(res.data.farm));
                setProgress(false);
                toast.show('सफल', { type: 'success', placement: 'bottom'});
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
    if (loading) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ProgressIndicator />
            </View>
        );
    }
    return (
        <View style={{flex: 1, backgroundColor: 'ivory', padding: 20}}>
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
    )
}

export default MeriDukaanScreen;
