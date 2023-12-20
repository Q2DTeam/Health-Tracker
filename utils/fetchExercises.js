export const fetchExercises = async() => {
    const url = 'https://script.google.com/a/macros/gm.uit.edu.vn/s/AKfycbwHLPLB1Ff-HZFHt0bfKBumQjflPPzIWbXdpjwM0Gp1PYUF8hx67yuWnFFUfzTI9Dw/exec';

    try {
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}