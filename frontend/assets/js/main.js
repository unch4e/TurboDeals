document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');
    const addCarButton = document.getElementById('addCarButton');

    if (token) {
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (profileButton) profileButton.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (addCarButton) addCarButton.style.display = 'inline-block';
    } else {
        if (loginButton) loginButton.style.display = 'inline-block';
        if (registerButton) registerButton.style.display = 'inline-block';
        if (profileButton) profileButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
        if (addCarButton) addCarButton.style.display = 'none';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            alert('You have logged out');
            window.location.reload(); 
        });
    }

    if (profileButton) {
        profileButton.addEventListener('click', () => {
            window.location.href = '/profile';
        });
    }

    
});
document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');

    if (profileButton) {
        profileButton.addEventListener('click', () => {
            window.location.href = '/profile';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            alert('You have been logged out');
            window.location.href = '/login';
        });
    }
});

