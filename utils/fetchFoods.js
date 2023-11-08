export const fetchFoods = async() => {
    const url = 'https://script.googleusercontent.com/macros/echo?user_content_key=mPaDey3VZXHt32GhhZLG_I4hcb07DfFihB5lIxI0sHvkqSVgtwwjUKXqnQmwFYhqzoMEljH_GkSUvr2cpqQtnFgn0nvTGZRjm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNmjl5ASSZQBLI0w6YZMN2JjK2kweH2GzVtzvXN585MwFSWT_szCsEEWhoJ17ttVXfPKQ5Vw-N3I2-q_QW48MiCB72ZYfI2o7A&lib=Mv_Mzn9BN5l5-yVDP8qX79Yt3FxpQbglj';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}