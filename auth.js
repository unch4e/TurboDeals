console.log('Script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) =>
            handleFormSubmit(e, '/api/auth/login', 'Login successful!', '/')
        );
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) =>
            handleFormSubmit(e, '/api/auth/register', 'Registration successful!', '/login')
        );
    }

    const addCarForm = document.getElementById('addCarForm');
    if (addCarForm) {
        addCarForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(addCarForm);
            const token = localStorage.getItem('token');

            if (!token) {
                alert('You must be logged in to add a car');
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch('/api/cars', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Car added successfully');
                    window.location.href = '/';
                } else {
                    console.error('Server response error:', data);
                    alert(data.message || 'Failed to add car');
                }
            } catch (error) {
                console.error('Error adding car:', error);
                alert('Something went wrong. Please try again.');
            }
        });
    }
});

async function handleFormSubmit(event, url, successMessage, redirectUrl) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });

        const data = await response.json();

        if (response.ok) {
            alert(successMessage);
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            window.location.href = redirectUrl;
        } else {
            console.error('Server response error:', data);
            alert(data.message || 'Request failed');
        }
    } catch (error) {
        console.error('Error during form submission:', error);
        alert('Something went wrong. Please try again.');
    }
}
