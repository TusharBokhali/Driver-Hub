import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import { Colors } from "../utils/Colors";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: string) => void;
    date?: string | Date;
};

const toISODate = (input: any): string => {
    const date = input instanceof Date ? input : new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function CalendarModal({
    visible,
    onClose,
    onSelectDate,
    date,
}: Props) {
    const isoDate = toISODate(date);

    return (
        <Modal isVisible={visible} animationIn={'slideInUp'} animationOut={'slideOutDown'} onBackdropPress={onClose} onBackButtonPress={onClose}>
            <View style={styles.container}>
                <Calendar
                    initialDate={isoDate}
                    onDayPress={(day) => {

                        onSelectDate(day.dateString);
                        onClose();
                    }}
                    markedDates={{
                        [isoDate]: { selected: true, selectedColor: Colors.green },
                    }}
                    theme={{
                        todayTextColor: Colors.primary,
                        selectedDayBackgroundColor: Colors.green,
                        arrowColor: Colors.dark,
                    }}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
    },
});
