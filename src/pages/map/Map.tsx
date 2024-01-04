import React, { useEffect, useState, useCallback } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { environment } from "../../constants/environment";

type Location = {
  latitude: number;
  longitude: number;
};

type Trainer = {
  name: string;
  rating: number;
  specialization: string;
  bio: string;
  phoneNumber: string;
  location: {
    coordinates: [number, number];
  };
};

const Map: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trainerLocations, setTrainerLocations] = useState<Trainer[]>([]);

  const getTrainers = async (latitude: number, longitude: number): Promise<Trainer[]> => {
    try {
      const response = await fetch(
        `${environment.baseUrl}trainers?lat=${latitude}&lng=${longitude}`
      );
      const data = await response.json();
      return data.result || [];
    } catch (error:any) {
      console.error("Error fetching trainers:", error.message);
      return [];
    }
  };

  const updateMapMarkers = (trainers: Trainer[], map: MapboxMap) => {
    if (
      trainers.length > 0 &&
      trainers[0].location &&
      trainers[0].location.coordinates
    ) {
      const [lat, lng] = trainers[0].location.coordinates;

      if (!isNaN(lng) && !isNaN(lat)) {
        map.flyTo({
          center: [lng, lat],
          zoom: 12,
        });

        trainers.forEach((trainer) => {
          if (trainer.location && trainer.location.coordinates) {
            const [lat, lng] = trainer.location.coordinates;

            if (!isNaN(lng) && !isNaN(lat)) {
              new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .setPopup(
                  new mapboxgl.Popup().setHTML(`
                <div style="max-width: 300px;">
                <h3 style="margin-bottom: 5px;">${trainer.name}</h3>
                <p style="margin-bottom: 5px;">Rating: ${trainer.rating}</p>
                <p style="margin-bottom: 5px;">Specialization: ${trainer.specialization}</p>
                <p style="margin-bottom: 5px;">Bio: ${trainer.bio}</p>
                <p style="margin-bottom: 5px;">Phone Number: ${trainer.phoneNumber}</p>
                </div>
             `)
                )
                .addTo(map);
            } else {
              console.error("Invalid coordinates for trainer:", trainer);
            }
          }
        });
      } else {
        console.error(
          "Invalid coordinates for the first trainer:",
          trainers[0]
        );
      }
    } else {
      console.error("No valid trainers data available.");
    }
  };

  const handleSearch = useCallback(
    async (query: string, map: MapboxMap) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxgl.accessToken}`
        );

        if (!response.ok) {
          throw new Error(
            `Geocoding API request failed with status: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const center = data.features[0].center;
          console.log("center--------", center);
          if (!isNaN(center[0]) && !isNaN(center[1])) {
            setLocation({ latitude: center[1], longitude: center[0] });

            const trainers = await getTrainers(center[1], center[0]);
            console.log(trainers, "-----------");
            setTrainerLocations(trainers);
            updateMapMarkers(trainers, map);
          } else {
            console.error("Invalid coordinates in geocoding response:", center);
            // Handle this case, e.g., show an error message to the user
          }
        } else {
          console.error("No features found in geocoding response:", data);
          // Handle this case, e.g., show an error message to the user
        }
      } catch (error:any) {
        console.error("Error during search:", error.message);
        // Handle this case, e.g., show an error message to the user
      }
    },
    [updateMapMarkers]
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
    }
  }, []);

  useEffect(() => {
    if (location) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZ2hhbmE3OTg5IiwiYSI6ImNscWtpZGtxdDF6aW8ya3M1c21udGt2eTAifQ.5Pr2qf16ZFtseeidZomxwQ";
  
      const initializedMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [location.longitude, location.latitude],
        zoom: 12,
      });
  
      setMap(initializedMap);
  
      getTrainers(location.latitude, location.longitude).then((trainers) => {
        setTrainerLocations(trainers);
        updateMapMarkers(trainers, initializedMap);
      });
    }
  }, [location]);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch(searchQuery, map!); // Use optional chaining here
      }
    };
  
    document.addEventListener("keypress", handleKeyPress);
  
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [location, trainerLocations, searchQuery, handleSearch, map]);
  
  return (
    <div>
      <div id="map" className="h-screen"></div>
      <div className="w-full h-[3rem] absolute top-5 left-0 flex justify-center align-center">
        <div className="w-[25rem] border border-black rounded-full">
          <input
            className="w-full h-full text-center outline-none rounded-full px-2"
            type="search"
            placeholder="Enter location name to find trainer"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Map;
