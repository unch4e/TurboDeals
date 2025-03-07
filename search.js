document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const carList = document.getElementById('carList');
    const loading = document.getElementById('loading');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loading.style.display = 'block';
        const formData = new FormData(searchForm);
        const filters = {};
        formData.forEach((value, key) => {
            if (value.trim()) {
                filters[key] = value.trim();
            }
        });
        try {
            const response = await fetch('/api/cars/filter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }

            const cars = await response.json();
            
            loading.style.display = 'none';
            carList.innerHTML = '';
            if (cars.length === 0) {
                carList.innerHTML = '<p>No cars match your search criteria.</p>';
                return;
            }
            cars.forEach(car => {
                const imagePath = car.images.length > 0 ? car.images[0] : '/frontend/assets/images/default.png';

                const carCard = `
                    <a href="/pages/car-details.html?id=${car._id}" class="car-card">
                        <img src="${imagePath}" alt="${car.brand} ${car.model}">
                        <h3>${car.brand} ${car.model}</h3>
                        <p>${car.year} - ${car.mileage || 'N/A'} km - ${car.fuelType || 'N/A'}</p>
                        <p class="price">$${car.price}</p>
                    </a>
                `;
                carList.innerHTML += carCard;
            });
        } catch (error) {
            console.error('Error fetching cars:', error);
            loading.style.display = 'none';
            carList.innerHTML = '<p>Failed to load cars. Please try again.</p>';
        }
    });
});
