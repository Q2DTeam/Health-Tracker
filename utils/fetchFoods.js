export const fetchFoods = async() => {
    const url = 'https://script.google.com/macros/s/AKfycbzwbCMVdi24VliCVinFJW_tf-nWkdIipLsEO2unHvZHyaZqjKtgSMHp4kZ49yIR9uTS/exec';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}