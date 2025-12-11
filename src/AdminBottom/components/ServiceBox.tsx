import { Images } from '@/assets/Images';
import { Colors } from '@/src/utils/Colors';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface Type {
    color: string;
    Icon: string | any,
    Title: string;
    SubTitle: string;
    Count: number;
    Arrow: boolean;
    SubColor?: string;
    ContainerWidth?:string | any;
    TitleColor?:string;
    CountColor?:string
}
export default function ServiceBox({ color, Icon, Title, SubTitle, Count, Arrow, SubColor = Colors.green, ContainerWidth, TitleColor, CountColor}: Type) {
    return (
        <View style={[styles.container,ContainerWidth && {width:ContainerWidth}]}>
            <View style={[styles.IconContainer,{backgroundColor:color}]}>
                <Image
                    source={Icon}
                    style={styles.Icon}
                    tintColor={Colors.black}
                />
            </View>
            <Image
                source={Images.UpArrow}
                style={[styles.Arrow,!Arrow && {transform:[{rotate:'180deg'}]}]}
            />
            <Text style={[styles.CountText,CountColor&& {color:CountColor}]}>{Count || 0}</Text>
            <Text style={[styles.Title,TitleColor&&{color:TitleColor}]}>{Title}</Text>
            <Text style={[styles.SubTitle, SubColor && { color: SubColor }]}>{SubTitle || 0}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "48%",
        padding: 10,
        backgroundColor: Colors.Bg,
        borderRadius: 12,
        elevation: 2
    },
    IconContainer: {
        width: 40,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10
    },
    Icon: {
        width: 20,
        height: 20,
    },
    CountText: {
        fontSize: 24,
        color: Colors.black,
        fontFamily: "regular",
        marginVertical:2
    },
    Title: {
        fontSize: 14,
        color: Colors.dark,
        fontFamily: "regular",
        marginVertical:1
    },
    SubTitle: {
        fontSize: 12,
        color: Colors.green,
        fontFamily: "regular"
    },
    Arrow: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: 15,
        top: '35%'
    }
});