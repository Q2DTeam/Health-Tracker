export const fetchExercises = async() => {
    const url = 'https://script.google.com/macros/s/AKfycbyh9PCaqohd6VmZRMrk6RCfCw5zNzj0nOvHcRAdATgYZCVsv78D7VQ-Fi_59QbSOwA/exec';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}