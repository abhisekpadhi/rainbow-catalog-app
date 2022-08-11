import {ActivityIndicator, Text, View} from 'react-native';
import React from 'react';

export const ProgressIndicator = () => {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <ActivityIndicator color={'black'} size={'small'} style={{marginRight: 10}} />
            <Text style={{ color: 'black'}}>Processing ...</Text>
        </View>
    )
}
