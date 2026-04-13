import React from 'react';
import {   
    View,
    Text,
    ActivityIndicator
} from 'react-native';

export interface Loading
{
    ready : boolean,
    title : string
    message : string
    
}

export const LoadingModal = ({ready, title, message}: Loading) =>
{
    if (!ready)
    {
        return(
            <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 5
            }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 32,
                    alignItems: 'center',
                    width: '75%',
                    marginBottom: 270
                    }}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 16 }}>
                        {title}
                    </Text>
                    <Text style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
                        {message}
                    </Text>
                </View>
            </View>
        )
    }
    else
        return null;
}

export default LoadingModal;