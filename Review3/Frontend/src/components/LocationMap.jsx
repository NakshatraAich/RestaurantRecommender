/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import { useState, useEffect } from 'react'

function LocationMarker({ onLocationChange }) {
  const [position, setPosition] = useState(null)
  const [location, setLocation] = useState({ lat: null, lng: null });
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setLocation({lat:e.latlng.lat, lng:e.latlng.lng})
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })

  useEffect(() => {
    if (location.lat !== null && location.lng !== null) {
      console.log(location.lng, location.lat);
    }
  }, [location]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

const LocationMap = ({ onLocationChange }) => {  
  return (
      <MapContainer
        id='map'
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={25}
        scrollWheelZoom={false}
        style={{ height: '100vh', width: '100%' }} // Add styles to ensure the map container takes up space
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationChange={onLocationChange}/>
      </MapContainer>
  );
};

export default LocationMap;
