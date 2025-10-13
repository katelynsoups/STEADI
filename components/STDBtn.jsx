import {Pressable, StyleSheet } from 'react-native'
import React from 'react'

function STDBtn({style, ...props})
{
    return (
        <Pressable
            style = {({pressed}) =>
                [
                    styles.btn, 
                    styles.shadowAND,
                    pressed && styles.pressed,
                    style
                ]}
            {...props}
        />
    )
}

export default STDBtn

const styles = StyleSheet.create(
{
    btn: 
    {
        backgroundColor: "#2853a7",
        borderRadius: 7.67,
        height: 37,
        position: 'absolute',
        width: 214,
    },

    shadow:
    {
        shadowColor: 'rgba(55, 93, 251, 100)',
        //Android props
        elevation: 100,
        //IOS props
    },

    pressed:
    {
        opacity: 0.5
    }
})