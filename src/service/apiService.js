const API_BASE_URL = 'http://localhost:3001/api';

export const submitForm = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/submit-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                submittedAt: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getSubmissions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/submissions`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};