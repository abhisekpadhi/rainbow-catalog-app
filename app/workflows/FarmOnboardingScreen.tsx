import React, {useState} from 'react';
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ProgressIndicator} from '../common/components/ProgressIndicator';

function FarmOnboardingScreen() {
    const [phone, setPhone] = useState('');
    const [farmName, setFarmName] = useState('');
    const [email, setEmail] = useState('');
    const [progress, setProgress] = useState(false);
    const handleFarmOnboarding = async () => {
        if (farmName.length > 0 && phone.length > 0) {
            // todo: api call

        } else {
            Alert.alert('गोदाम का नाम और फोन नंबर आवश्यक है');
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
                autoFocus={true}
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
            <Text style={{fontSize: 18, paddingTop: 20, paddingBottom: 8,}}>
                अपने गोदाम का ईमेल (छोड़ सकते हैं)
            </Text>
            <TextInput
                autoFocus={true}
                value={email}
                onChangeText={setEmail}
                keyboardType={'number-pad'}
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
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
                            आगे बढ़े
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FarmOnboardingScreen;
