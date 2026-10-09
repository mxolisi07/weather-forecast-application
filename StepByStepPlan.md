BEGIN PROJECT

STEP 1: Setup & Foundation
    - Install Node.js
    - Create new React project with Vite
    - Install libraries: Axios, React Router, React Icons
    - Setup folder structure:
        components/
        pages/
        services/
    - Test with "Hello World" on screen

STEP 2: Connect to Weather API
    - Get API Key
    - Store key in .env file
    - Create service file to fetch:
        Current weather
        Hourly forecast
        Daily forecast
    - Test: Print London temperature in console

STEP 3: Location Detection
    - Use navigator.geolocation API
    - Ask user permission
    - If granted -> get latitude & longitude
    - If denied -> default to Johannesburg
    - Convert coordinates -> city name (reverse geocoding)
    - Show detected city

STEP 4: Search & Save Locations
    - Create search bar
    - Show autocomplete suggestions
    - On select -> fetch weather for city
    - Add "Save" (Star) button
    - Save cities in LocalStorage
    - Build dropdown/sidebar to switch between saved cities

STEP 5: Build User Interface
    - Main Card: temperature, icon, city name
    - Details Grid: humidity, wind, pressure, UV
    - Toggle Buttons: Celsius vs Fahrenheit
    - Forecast Strip: horizontal scroll for 24h
    - Settings Page: theme toggle, unit toggle
    - Loading Spinner + Error Message

STEP 6: Offline Mode & Caching
    - Save fetched data in LocalStorage with timestamp
    - On load -> check internet connection
    - If offline -> show cached data + banner
    - If online -> fetch fresh data and update cache

STEP 7: Alerts, Polish & Privacy
    - Weather Alerts -> Notification API
    - Performance -> React lazy loading
    - Privacy -> disclaimer about location use
    - Test on mobile, tablet, desktop
    - Deploy -> Vercel or Netlify

END PROJECT
