export const fetchFoods = async() => {
    const url = 'https://script.google.com/macros/s/AKfycbxs0hv0XjsblJB1Y9m-qlEB9UzISrWmbWiuztFBINC8-PRV_V9TCCvbxNqyNL4L_EIj/exec';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}