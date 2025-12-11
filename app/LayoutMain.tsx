import ToastMessage from '@/src/components/ToastMessage';
import { ToastShow } from '@/src/context/ToastContext';
import React, { useContext } from 'react';
import { View } from 'react-native';

export default function LayoutMain({ children }: any) {
    const { Toast, setToast } = useContext(ToastShow);
    return (
        <View style={{flex:1}}>
            {children}
            {Toast.visible && (
                <ToastMessage
                    type={Toast?.type}
                    message={Toast?.message}
                    onHide={() => setToast({ ...Toast, visible: false })}
                />
            )}
        </View>
    )
}