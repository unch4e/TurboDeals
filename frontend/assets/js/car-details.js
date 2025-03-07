document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    if (!carId) {
        alert('Car ID not found.');
        window.location.href = '/';
        return;
    }
    try {
        const response = await fetch(`/api/cars/${carId}`);
        const car = await response.json();
        if (!response.ok) {
            throw new Error(car.message || 'Failed to fetch car details.');
        }
        document.getElementById('carTitle').textContent = `${car.brand} ${car.model}`;
        document.getElementById('carBrand').textContent = car.brand;
        document.getElementById('carModel').textContent = car.model;
        document.getElementById('carYear').textContent = car.year;
        document.getElementById('carPrice').textContent = car.price;
        document.getElementById('carMileage').textContent = car.mileage || 'N/A';
        document.getElementById('carFuelType').textContent = car.fuelType || 'N/A';
        document.getElementById('carDescription').textContent = car.description || 'No description available.';
    
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.getElementById('thumbnails');

        if (car.images && car.images.length > 0) {
            mainImage.src = car.images[0];      
            car.images.forEach(image => {
                const img = document.createElement('img');
                img.src = image;
                img.alt = 'Car Thumbnail';
                img.addEventListener('click', () => {
                    mainImage.src = image;
                });
                thumbnails.appendChild(img);
            });
        } else {
            mainImage.src = '/frontend/assets/images/default.png';
        }                
    } catch (error) {
        console.error('Error fetching car details:', error);
        alert('Failed to load car details.');
        window.location.href = '/';
    }
});
