import React, {useEffect, useState} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanOpScreen from '../../workflows/ScanOpScreen';
import HomeScreen from '../../workflows/HomeScreen';
import FarmInventoryScreen from '../../workflows/FarmInventoryScreen';
import FarmInventoryLedgerScreen from '../../workflows/FarmInventoryLedgerScreen';
import MeriDukaanScreen from '../../workflows/MeriDukaanScreen';
import NewOrderScreen from '../../workflows/NewOrderScreen';
import AllOrderScreen from '../../workflows/AllOrderScreen';
import FarmOnboardingScreen from '../../workflows/FarmOnboardingScreen';
import {useSelector} from 'react-redux';
import {CredentialsState} from '../redux/credentialsReducer';
import Login from '../../workflows/Login';

export type AppStackParamList = {
    [k: string]: any;
    ScanOpScreen: {
        inward: boolean;
    };
};

export const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppStackScreens = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const credsStore: CredentialsState = useSelector((state: any) => state.credentialsReducer);
    useEffect(() => {
        if (credsStore.accessToken.length > 0) {
            console.log('navigator - loggedIn');
            setIsLoggedIn(true);
        }
    }, [credsStore]);
    return (
        <AppStack.Navigator
            screenOptions={({route, navigation}) => {
                return {
                    headerTintColor: '#414141',
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                };
            }}>
            {isLoggedIn ? (
                <>
                    <AppStack.Screen name={'HomeScreen'} component={HomeScreen} />
                    <AppStack.Screen name={'ScanOpScreen'} component={ScanOpScreen} />
                    <AppStack.Screen name={'FarmInventoryScreen'} component={FarmInventoryScreen} />
                    <AppStack.Screen name={'FarmInventoryLedgerScreen'} component={FarmInventoryLedgerScreen} />
                    <AppStack.Screen name={'MeriDukaanScreen'} component={MeriDukaanScreen} />
                    <AppStack.Screen name={'NewOrderScreen'} component={NewOrderScreen} />
                    <AppStack.Screen name={'AllOrderScreen'} component={AllOrderScreen} />
                    <AppStack.Screen name={'FarmOnboardingScreen'} component={FarmOnboardingScreen} />
                </>
            ) : (
                <>
                    <AppStack.Screen name={'Login'} component={Login} />
                </>
            )}
        </AppStack.Navigator>
    );
};

export default AppStackScreens;
