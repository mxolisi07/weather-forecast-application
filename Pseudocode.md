BEGIN PROJECT

STEP 1: Setup & Foundation
    INSTALL Node.js
    CREATE React project with Vite
    INSTALL React Router, Tailwind CSS, React Icons
    SETUP folders: components/, pages/, services/, hooks/, context/
    DISPLAY "Hello World" on screen

STEP 2: Connect to Weather API
    SIGN UP at example.org
    GET API Key
    SAVE key in .env file
    CREATE service file:
        FUNCTION fetchWeather(city):
            CALL fetch("https://api.example.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY)
            CONVERT response -> JSON
            RETURN data
    TEST: fetchWeather("London") → PRINT temperature in console

STEP 3: Location Detection
    USE navigator.geolocation.getCurrentPosition()
    IF permission granted:
        GET latitude, longitude
        CALL fetch("https://api.example.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY)
        RETURN city + weather
    ELSE:
        DEFAULT city = "Johannesburg"
        SHOW message "Using default city"

STEP 4: Search & Save Locations
    CREATE search bar
    ON input -> FETCH suggestions
    ON select -> fetchWeather(city)
    ADD "Save" button
    SAVE city list in LocalStorage
    LOAD saved cities into dropdown/sidebar

STEP 5: Build User Interface
    CREATE Main Card: temperature, icon, city name
    CREATE Details Grid: humidity, wind, pressure, UV
    ADD Toggle Buttons:
        - Hourly vs Daily
        - Celsius vs Fahrenheit
    FUNCTION convertTemp(value, unit):
        IF unit == "C":
            RETURN value - 273.15
        IF unit == "F":
            RETURN (value - 273.15) * 9/5 + 32
    DISPLAY converted temperature based on toggle
    ADD Forecast Strip: scrollable 24h
    CREATE Settings Page: theme toggle, unit toggle
    ADD Loading Spinner + Error Message

STEP 6: Offline Mode & Caching
    ON fetchWeather(city):
        SAVE data + timestamp in LocalStorage
    ON app load:
        IF offline -> LOAD cached data
        SHOW banner "Showing cached data"
        ELSE -> FETCH fresh data

STEP 7: Alerts, Polish & Privacy
    USE Notification API for severe weather alerts
    OPTIMIZE with React lazy loading
    ADD Privacy disclaimer
    TEST on mobile, tablet, desktop
    DEPLOY app -> Vercel or Netlify

END PROJECT
