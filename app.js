const ONE_HOUR = 3600;
const d = new Date();
const hour = d.getHours();

window.addEventListener('load', () => {
    window.setInterval(updateTime, 1000);
    let long;
    let lat;
    let temperatureDegree = document.querySelector('.temp-degree');
    let temperatureDescription = document.querySelector('.temp-description');
    let tempFeelsLike = document.querySelector('.temp-feels-like')
    let locationTimezone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature');
    const degreeSpan = document.querySelector('.degree-section span');
    const feelsSpan = document.querySelector('.feelslike span');

    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition (position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            
            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=hourly,daily&appid=c89925050b583198fdc38d6d35d5f55a`

            fetch(api)
            .then(response => {
                return response.json();
            })
            .then (data => {
                // console.log(data)
                const curr = d.getTime() / 1000
                document.getElementById('enabler').classList.add('invisible');

                const { temp, feels_like, dt, sunrise, sunset } = data.current;
                const { id, description } = data.current.weather[0];
                const timezone = data.timezone;
                const { icon } = data.current.weather[0];

                // set DOM elements
                temperatureDegree.textContent = Math.round(temp);
                tempFeelsLike.textContent = Math.round(feels_like);
                temperatureDescription.textContent = description.toLowerCase();
                locationTimezone.textContent = timezone.toLowerCase();
                
                
                // Set background
                changeBg(dt, sunrise, sunset)

                // Set Icon
                setIcon(icon, document.querySelector(".icon"), id)
                
                // Fahrenheit formulas
                let fahrenheit = (temp + 32) * (9 / 5);
                let ffahrenheit = (feels_like + 32) * (9 / 5);

                // Switch temperature C/F
                temperatureSection.addEventListener("click", () => {
                    if (degreeSpan.textContent === "°C") {
                        degreeSpan.textContent = "°F";
                        feelsSpan.textContent = "°F";
                        temperatureDegree.textContent = Math.round(fahrenheit);
                        tempFeelsLike.textContent = Math.round(ffahrenheit);
                    } else {
                        degreeSpan.textContent = "°C";
                        feelsSpan.textContent = "°C";
                        temperatureDegree.textContent = Math.round(temp);
                        tempFeelsLike.textContent = Math.round(feels_like);
                        
                    };      
                });
            });
        });         
    };

// functions

    // set weather icon
    function setIcon(icon, iconID, weatherID) {
        const skycons = new Skycons({color: "white"});
        let currentIcon;
        console.log(icon)
        switch (icon){
            case "01d":
                currentIcon =  "CLEAR_DAY";
                break;
            case "01n":
                currentIcon = "CLEAR_NIGHT";
                break;
            case "02d":
            case "03d":
                currentIcon = "PARTLY_CLOUDY_DAY";
                break;
            case "02n":
            case "03n":
                currentIcon = "PARTLY_CLOUDY_NIGHT";
                break;
            case "04d":
            case "04n":
                currentIcon = "CLOUDY";
                break;
            case "09d":
            case "09n":
                currentIcon = "RAIN";
                break;
            case "10d":
            case "10n":
                currentIcon = "RAIN";
                break;
            case "11d":
            case "11n":
                if (weatherID >= 210 && weatherID <= 221) {
                    currentIcon = "THUNDER";
                } else {
                    currentIcon = "THUNDER_RAIN";
                }
                break;
            case "13d":
                if (weatherID == 600) {
                    currentIcon =  "SNOW_SHOWERS_DAY"
                } else if (weatherID >= 611 && weatherID <= 613) {
                    currentIcon = "SLEET";
                } else if (weatherID >= 615 && weatherID <= 622) {
                    currentIcon = "RAIN_SNOW_SHOWERS_DAY";
                } else {
                    currentIcon = "SNOW";
                }
                break;
            case "13n":
                if (weatherID == 600) {
                    currentIcon =  "SNOW_SHOWERS_NIGHT"
                } else if (weatherID >= 611 && weatherID <= 613) {
                    currentIcon = "SLEET";
                } else if (weatherID >= 615 && weatherID <= 622) {
                    currentIcon = "RAIN_SNOW_SHOWERS_NIGHT";
                } else {
                    currentIcon = "SNOW";
                }
                break;
            case "15d":
            case "15n":
                currentIcon = "FOG";
                break;
        }
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon])
    }; 

    // change bg depending on time
    function changeBg(now, sunrise, sunset) {
        if (document.body) {
            if ((now >= sunrise - ONE_HOUR) && (now <= sunrise + ONE_HOUR)) {
                document.body.className = "sunrise";
            } else if ((now >= sunset - ONE_HOUR) && (now <= sunset + ONE_HOUR)) {
                document.body.className = "sunset";
            } else if (7 <= hour && hour < 20) {
                document.body.className = "day";
            }
            else {
                document.body.className = "night";
            }
        }   
    };

    // set timer 
    function updateTime() {
        var currTime = "";
        var now = new Date();
        currTime += ('0' + now.getHours()).slice(-2) +":" + ('0' + now.getMinutes()).slice(-2) + ":" + ('0' + now.getSeconds()).slice(-2);
        document.getElementById("time").innerHTML = currTime;
    };
});
