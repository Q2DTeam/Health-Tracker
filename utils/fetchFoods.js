export const fetchFoods = async() => {
    const url = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result.meals;
    } catch (error) {
        console.error(error);
    }
}