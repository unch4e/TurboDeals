document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    const form = document.getElementById('addCarForm');

    if (!form) {
        console.error('Form with ID "addCarForm" not found.');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        console.log('Form submitted');

        const formData = new FormData(form);

        const token = localStorage.getItem('token');
        console.log('Token:', token);
        
        if (!token) {
            alert('You must be logged in to add a car');
            window.location.href = '/login';
            return;
        }

        const requiredFields = ['brand', 'model', 'year', 'price', 'mileage', 'fuelType', 'condition'];
        for (const field of requiredFields) {
            if (!formData.get(field)) {
                alert(`Field "${field}" is required.`);
                return;
            }
        }

        try {
            const response = await fetch('/api/cars', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData, 
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to add car');
            }

            const data = await response.json();
            console.log('Server response:', data);
            alert('Car added successfully');
            window.location.href = '/'; 
        } catch (error) {
            console.error('Error adding car:', error);
            alert(`Error adding car: ${error.message || 'Please try again.'}`);
        }
    });
});
