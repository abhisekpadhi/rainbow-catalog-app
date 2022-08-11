import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default function NewOrderScreen() {
    const navigation = useNavigation();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'नए ऑर्डर',
        });
    });
    const orderUnit = () => {
        return (
            <View
                style={{
                    borderRadius: 6,
                    elevation: 4,
                    backgroundColor: 'white',
                    marginVertical: 6,
                    marginHorizontal: 10,
                }}
            >
                <View
                    style={{
                        paddingVertical: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#FFCC80',
                    }}
                >
                    <Text
                        style={{
                            color: 'black',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                        }}
                    >
                        Status: Active
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
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            borderRightWidth: 1,
                            borderStyle: 'dashed',
                            borderRightColor: 'grey',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}
                        >order_165938280474677</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                            }}
                        >211 Jul, 2022, 04:30 PM</Text>
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
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            borderRightWidth: 1,
                            borderStyle: 'dashed',
                            borderRightColor: 'grey',
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}
                        >Delivery address</Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}
                        >
                            443/1987-U, Road 11, Sector 24, Raj road, behing random chowk
                        </Text>

                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                                fontWeight: 'bold',
                            }}
                        >Customer</Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'right',
                            }}
                        >
                            John Doe Ji, +919876543210, johnji@mail.co
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
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}
                        >Customer note</Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}
                        >
                            please do good packaging, delivery at chinchiwad godown, bring tata ace, rasta kharab he
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                    }}
                >
                    <View
                        style={{
                            flex: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}
                        >Item list</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >Qty</Text>
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
                    }}
                >
                    <View
                        style={{
                            flex: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}
                        >
                            Tomato (orange, grade 6, medium) 25kg pack
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'center',
                            }}
                        >6</Text>
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
                    }}
                >
                    <View
                        style={{
                            flex: 3,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                            }}
                        >
                            Onion (orange, grade 6, medium) 25kg pack
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 12,
                                textAlign: 'center',
                            }}
                        >4</Text>
                    </View>
                </View>
                <View
                    style={{
                        paddingVertical: 10,
                    }}
                >
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 4, paddingBottom: 6 }}>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 6,
                                paddingHorizontal: 8,
                                backgroundColor: '#FFCC80',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                elevation: 4,
                                marginRight: 10,
                            }}
                        >
                            <Image source={require('../img/invoice.png')} style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 4}} />
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Invoice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 6,
                                paddingHorizontal: 8,
                                backgroundColor: '#FF8080',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                elevation: 4,
                                marginRight: 10,
                            }}
                        >
                            <Image source={require('../img/cancel.png')} style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 4}} />
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 6,
                                paddingHorizontal: 8,
                                backgroundColor: '#80E8FF',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                elevation: 4,
                                marginRight: 10,
                            }}
                        >
                            <Image source={require('../img/map.png')} style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 4}} />
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Map</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                paddingVertical: 6,
                                paddingHorizontal: 8,
                                backgroundColor: '#91FF80',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                elevation: 4,
                                marginRight: 10,
                            }}
                        >
                            <Image source={require('../img/done.png')} style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 4}} />
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Done</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                {orderUnit()}
            </ScrollView>
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
