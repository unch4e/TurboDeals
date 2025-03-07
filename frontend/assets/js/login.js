document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || 'Login failed');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        window.location.href = '/';
    } catch (error) {
        console.error('Error during login:', error);
        alert('Something went wrong. Please try again.');
    }
});
