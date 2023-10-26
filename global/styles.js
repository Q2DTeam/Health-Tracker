import { StyleSheet } from "react-native";

export const globalColors = {
    'vibrantBlue': '#0099FF',
    'breakfastGreen': '#2ED12E',
    'lunchOrange': '#FFA935',
    'dinnerCyan': '#12E5B0',
    'snackPurple': '#B575E7',
    'backgroundGray': '#F2F5FC',
    'textGray': '#9EA9C3',
}

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        backgroundColor: globalColors.backgroundGray,
    },
    header: {
        width: '100%',
        height: 150,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: globalColors.backgroundGray,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
    },
    searchBar: {
        width: '100%',
        height: 44,
        backgroundColor: globalColors.backgroundGray,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 5,
    },
});