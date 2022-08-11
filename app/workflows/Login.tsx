import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {loginWithOtp, requestOtp} from './api';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {addCreds, addFarmer} from '../common/redux/actions';
import dayjs from 'dayjs';

function Login(props: {onLogin: () => void}) {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    });
    const [phone, setPhone] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const handleLogin = async () => {
        const payload = {
            farmer: {
                phone,
                farmerName: '',
            },
            otp,
        };
        const res = await loginWithOtp(payload);
        console.log('login response', res);
        dispatch(addFarmer(res.data.farmer));
        dispatch(
            addCreds({
                accessToken: res.data.jwt,
                accessTokenUpdatedAtMs: dayjs().valueOf(),
                refreshToken: '',
                refreshTokenUpdatedAtMs: 0,
            }),
        );
    };
    const handleOtpRequest = async () => {
        if (phone.length < 10) {
            Alert.alert('फ़ोन नंबर 10 अंकों का होना चाहिए');
            return;
        }
        const ph = phone.slice(-10);
        const resp = await requestOtp({phone: ph});
        if (resp.errors !== null) {
            Alert.alert('त्रुटि हुई: ', JSON.stringify(resp.errors));
            return;
        }
        if ((resp.data?.message || '').toLowerCase() === 'ok') {
            setShowOtp(true);
            return;
        } else {
            Alert.alert('ओटीपी का अनुरोध करने में विफल, कुछ समय बाद पुनः प्रयास करें');
        }
    };
    return (
        <View style={{flex: 1, backgroundColor: 'ivory', padding: 20}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', color: 'black'}}>रजिस्टर/लॉलिन करें</Text>
            <Text style={{fontSize: 18, paddingTop: 20, paddingBottom: 8}}>
                अपना मोबाइल नंबर दर्ज करें
            </Text>
            <TextInput
                autoFocus={true}
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
            {showOtp && (
                <>
                    <Text style={{fontSize: 18, paddingTop: 20, paddingBottom: 8,}}>
                        एक एसएमएस आयेगा जिसमे चार अंक का कोड हे
                    </Text>
                    <TextInput
                        autoFocus={true}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType={'number-pad'}
                        placeholder={'उदाहरण के लिए 2245'}
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
                </>
            )}
            <View style={{ paddingVertical: 20}}>
                <TouchableOpacity
                    onPress={() => {
                        if (!showOtp) {
                            handleOtpRequest().then(_ => {});
                        }
                        if (showOtp && otp.length === 4) {
                            handleLogin().then(_ => {});
                        }
                    }}
                    style={{
                        backgroundColor: 'coral',
                        paddingVertical: 12,
                        alignItems: 'center',
                        marginRight: 16,
                        borderRadius: 6,
                        elevation: 6,
                        width: '100%',
                    }}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
                        आगे बढ़े
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;
