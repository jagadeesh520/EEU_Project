import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, Platform } from 'react-native';

const FindCSC = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'black' }}>{"Coming Soon....!"}</Text> 
        </View>
        </SafeAreaView>
    );
}

export default FindCSC;