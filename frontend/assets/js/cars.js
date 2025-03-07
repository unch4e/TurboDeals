async function fetchCars() {
    const carList = document.getElementById('carList');
    const loadingIndicator = document.getElementById('loading');
    try {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        const response = await fetch('/api/cars', { method: 'GET' });
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        if (response.ok) {
            const cars = await response.json();
            if (!Array.isArray(cars) || cars.length === 0) {
                carList.innerHTML = '<p>No cars available</p>';
                return;
            }
            carList.innerHTML = cars.map(car => {
                const carImage = car.images?.length > 0 
                    ? `/uploads/${car.images[0]}` 
                    : '/frontend/assets/images/default.png';
                const brand = car.brand || 'Unknown Brand';
                const model = car.model || 'Unknown Model';
                const year = car.year || 'Unknown Year';
                const mileage = car.mileage || 'N/A';
                const fuelType = car.fuelType || 'N/A';
                const price = car.price ? `$${car.price}` : 'N/A';

                return `
                    <div class="car-card">
                        <a href="/pages/car-details.html?id=${car._id}">
                            <img src="${carImage}" alt="${brand} ${model}">
                        </a>
                        <h3>${brand} ${model}</h3>
                        <p>${year} - ${mileage} km - ${fuelType}</p>
                        <p class="price">${price}</p>
                    </div>
                `;
            }).join('');
        } else {
            const errorData = await response.json();
            console.error('API Error:', errorData.message);
            carList.innerHTML = `<p>Error loading cars: ${errorData.message || 'Unknown error'}</p>`;
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        carList.innerHTML = '<p>Error loading cars</p>';
    }
}

function renderCars(cars) {
    const carList = document.getElementById('carList');
    carList.innerHTML = '';

    cars.forEach(car => {
        const imagePath = car.images.length > 0 ? car.images[0] : '/frontend/assets/images/default.png';

        const carCard = `
            <div class="car-card">
                <img src="${imagePath}" alt="${car.brand} ${car.model}">
                <h3>${car.brand} ${car.model}</h3>
                <p>${car.year} - ${car.mileage || 'N/A'} km - ${car.fuelType || 'N/A'}</p>
                <p class="price">$${car.price}</p>
            </div>
        `;

        carList.innerHTML += carCard;
    });
}


document.addEventListener('DOMContentLoaded', fetchCars);
