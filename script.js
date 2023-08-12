

const omitData = {
    "last_updated_epoch": true,
    "last_updated": true,
    "pressure_mb": true,
    "pressure_in": true,
    "precip_mm": true,
    "precip_in": true,
    "vis_km": true,
    "vis_miles": true
};

function filterData(data) {

    console.log(data);

    let filteredData = {};
    
    for (let key in data.current) {
        // Use the capitalized version of the key for checking in omitData
        const formattedKey = capitalizeFirstLetter(key.replace(/_/g, ' '));
        if (!omitData[formattedKey]) {
            filteredData[key] = data.current[key];
        }
    }
    return filteredData;
}

const getCurrentWeather = async function (key, location) {
    const baseURL = 'http://api.weatherapi.com/v1';
    const apiKey = key; 
    const currentWeatherURL = `${baseURL}/current.json?key=${apiKey}&q=${location}`;

    try {
        console.time('Fetch Weather Data'); // Start the timer
        const response = await fetch(currentWeatherURL);
        console.timeEnd('Fetch Weather Data'); // End the timer and log the elapsed time

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        for (let key in omitData) {
            delete data.current[key];
        }

        console.log(data.current);

        return data;

    } catch (error) {
        console.error("There was an error fetching the weather data.", error);
    }
}

function capitalizeFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


function displayWeatherData(data) {
    const container = document.getElementById('weatherDataContainer');

    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.style.display = "none";
    container.appendChild(loader);
    

    console.log(data.location)
    // Add a title for the location
    const title = document.createElement('h2');
    title.innerText = `Weather for: ${data.location.name}, ${data.location.country}`;
    container.appendChild(title);

    // Dynamically create and append each data field
    for (let key in data.current) {

        
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('data-field');  // Adding class for styling

        const label = document.createElement('strong');
        label.innerText = capitalizeFirstLetter(key.replace(/_/g, ' ')) + ": ";
        fieldContainer.appendChild(label);

        const value = document.createElement('span');

        if (key == "condition") {
            value.innerText = data.current[key].text;
        } else {
            value.innerText = data.current[key];
        }

        fieldContainer.appendChild(value);

        const boxContainer = document.createElement('div');
        boxContainer.classList.add('data-box'); // Adding class instead of inline styles
        boxContainer.appendChild(fieldContainer);

        container.appendChild(boxContainer);
    }
}



async function fetchAndDisplayWeather(apiKey, location) {

    const container = document.getElementById('weatherDataContainer');

    

    // Show loader
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    try {
        const weatherData = await getCurrentWeather(apiKey, location);
        container.innerText = ""; // Clear previous weather data if any
        loader.style.display = 'block';
        displayWeatherData(weatherData);

        loader.style.display = 'none';
    } catch (error) {
        console.error("Error:", error);

        loader.style.display = 'none';
    }
}

const searchBar = document.querySelector("#weatherInput");


let searchButton = document.querySelector("#searchWeatherButton");
searchButton.addEventListener("click", function() {
    fetchAndDisplayWeather('16e1cbf3e66045ab954181944230808', searchBar.value);
})




// touchApi('16e1cbf3e66045ab954181944230808', 'London');