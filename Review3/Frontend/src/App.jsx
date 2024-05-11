/* eslint-disable no-unused-vars */
import LocationMap from "./components/LocationMap"
import RestaurantCard from "./components/RestaurantCard";
import axios from 'axios';
import { useState, useEffect } from "react";

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [budget, setBudget] = useState(500); // Initial budget from UI
  const [preference, setPreference] = useState(''); // Selected preference
  const [restaurants, setRestaurants] = useState([]);

  const handleLocation = (lat, lng) => {
    console.log(latitude, longitude);
  };

  const handleBudget = () => {

  }

  const handlePreference = () => {

  }

  const sendData = async () => {
    // Extract latitude, longitude, preference, and budget from component state
    const preference = document.querySelector('.select-secondary').value;
    const budget = document.querySelector('.range').value;
  
    try {
      const data = {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        cuisine: preference,
        budget: parseInt(budget) // Ensure budget is parsed as an integer
      };
      
      console.log(data)

      const response = await axios.post('http://localhost:8000/', data);
      setRestaurants(response.data); // Set the received restaurants in state
      console.log('API response:', response.data);
      // Handle successful response (e.g., navigate to results page)
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle API errors (e.g., display error message to user)
    }
  }

  const handleLocationChange = (lat,lng) => {
    setLatitude(lat);
    setLongitude(lng);
    console.log("Latitude:", lat, "Longitude:", lng);
  };

  // useEffect(() => {
  //   console.log(restaurants);
  // }, [restaurants]);

  return (
    <div className="p-8 flex flex-col gap-16">
      <div className="flex flex-col items-center justify-center h-[100vh]">
        <div className="text-6xl font-bold text-center mb-12">Find top restaurant <span className="bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text font-bold">recommendations.</span></div>
        <div className="w-fit flex flex-col mb-16">
          <div className="flex flex-col text-lg items-start">
            <div className="flex flex-row gap-4 items-center">
              <div className="text-sm bg-white rounded-full text-neutral font-bold w-6 h-6 flex items-center justify-center">1</div>
              <div className="font-medium">Set your location.</div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-row gap-4 items-center">
              <div className="text-sm bg-white rounded-full text-neutral font-bold w-6 h-6 flex items-center justify-center">2</div>
              <div className="font-medium">Select your cuisine preference.</div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-row gap-4 items-center">
              <div className="text-sm bg-white rounded-full text-neutral font-bold w-6 h-6 flex items-center justify-center">3</div>
              <div className="font-medium">Set your budget.</div>
            </div>
          </div>
        </div>
        <div className="btn btn-md bg-gradient-to-r from-primary to-secondary">
          <span className="px-10 py-2 font-bold text-[#222222]">Proceed</span>
        </div>
      </div>
      <div className="flex flex-col items-start h-[100vh]">
        <div className="text-left mt-24 mb-2 font-medium text-lg">Click on the map below to pin point your location</div>
        <LocationMap onLocationChange={handleLocationChange} />
        <div className="btn btn-md bg-gradient-to-r from-primary to-secondary grow-0 mt-8" onClick={handleLocation}>
          <span className="px-10 py-2 font-bold text-[#222222]">Proceed</span>
        </div>
      </div>
      <div className="h-[100vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center border-2 border-neutral p-20 rounded-3xl">
          <div className="font-semibold text-left mb-16 text-3xl">Set your budget</div>
          <div className="flex items-center mb-4">
            <span className="mr-4 text-lg font-medium">Budget: Rs.</span>
            <span id="range-value" className="text-lg font-medium">500</span>
          </div>
          <input
            type="range"
            min={300}
            max="5000"
            defaultValue="500"
            className="range range-primary w-[32rem]"
            onChange={(e) => document.getElementById("range-value").textContent = e.target.value}
          />
          <div className="btn btn-md bg-gradient-to-r from-primary to-secondary grow-0 mt-8" onClick={handleBudget}>
            <span className="px-10 py-2 font-bold text-[#222222]">Proceed</span>
          </div>
        </div>
      </div>
      <div className="h-[100vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center border-2 border-neutral p-20 rounded-3xl">
          <div className="font-semibold text-left mb-16 text-3xl">Set your cuisine preference</div>
          <select className="select select-secondary w-full max-w-xs">
            <option disabled selected>Pick your preferred cuisine</option>
            <option>North Indian</option>
            <option>South Indian</option>
            <option>Mughlai</option>
            <option>Chinese</option>
            <option>Italian</option>
            <option>Desert</option>
            <option>Bakery</option>
            <option>Continental</option>
          </select>
          <div className="btn btn-md bg-gradient-to-r from-primary to-secondary grow-0 mt-8" onClick={sendData}>
            <span className="px-10 py-2 font-bold text-[#222222]">Get Results</span>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col grow w-full flex-wrap justify-center">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} restaurant={restaurant} />
          ))}
        </div>      
      </div>
    </div>
  )
}
