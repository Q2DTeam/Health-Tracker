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
        height: 140,
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
        fontFamily: 'inter-regular',
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
    addButton: {
        backgroundColor: globalColors.vibrantBlue,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtn: {
        minWidth: 200,
        margin: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#282ddb',
        borderRadius: 25,
    },
    errorText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    form_inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingLeft: 5,
        width: Platform.OS === 'android' ? 300 : 260,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    form_label: {
        color: '#1d1c3b',
        backgroundColor: '#fff',
        padding: 8,
        position: 'relative',
        top: Platform.OS === 'android' ? -8.1 : -7,
        left: 0,
        borderRadius: 5,
        height: 40,
    },
    form_input: {
        fontSize: 18,
        flex: 1,
        marginLeft: 5,
        paddingLeft: 5,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});