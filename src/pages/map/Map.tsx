import React, { useEffect, useState, useCallback } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { environment } from "../../constants/environment";
import { useNavigate } from "react-router-dom";

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
  const [radius, setRadius] = useState<number>(10);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("USER_DATA");

    // Navigate to the login page
    navigate("/");
  };

  const getTrainers = async (
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Trainer[]> => {
    try {
      const response = await fetch(
        `${environment.baseUrl}trainers?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      const data = await response.json();
      return data.result || [];
    } catch (error: any) {
      console.error("Error fetching trainers:", error.message);
      return [];
    }
  };

  const updateMapMarkers = (trainers: Trainer[], map: MapboxMap) => {
    if (trainers.length > 0) {
      const [lat, lng] = trainers[0].location.coordinates;

      if (!isNaN(lng) && !isNaN(lat)) {
        map.flyTo({
          center: [lng, lat],
          zoom: 12,
        });

        // Clear existing markers
        document
          .querySelectorAll(".mapboxgl-marker")
          .forEach((marker) => marker.remove());

        trainers.forEach((trainer) => {
          if (trainer.location && trainer.location.coordinates) {
            const [lat, lng] = trainer.location.coordinates;

            if (!isNaN(lng) && !isNaN(lat)) {
              const marker = new mapboxgl.Marker()
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

              marker.getElement().addEventListener("click", () => {
                // Handle marker click if needed
              });
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

            const trainers = await getTrainers(center[1], center[0], radius);
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
      } catch (error: any) {
        console.error("Error during search:", error.message);
        // Handle this case, e.g., show an error message to the user
      }
    },
    [updateMapMarkers, radius]
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
      const userData = localStorage.getItem("USER_DATA");
      if (!userData) {
        navigate("/");
        return;
      }
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZ2hhbmE3OTg5IiwiYSI6ImNscWtpZGtxdDF6aW8ya3M1c21udGt2eTAifQ.5Pr2qf16ZFtseeidZomxwQ";

      const initializedMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [location.longitude, location.latitude],
        zoom: 12,
      });

      setMap(initializedMap);

      const fetchTrainersAndMarkers = async () => {
        const trainers = await getTrainers(
          location.latitude,
          location.longitude,
          radius
        );
        setTrainerLocations(trainers);
        updateMapMarkers(trainers, initializedMap);
      };

      fetchTrainersAndMarkers();

      // Listen for changes in radius and update trainers accordingly
      const handleRadiusChangeAndFetch = () => {
        fetchTrainersAndMarkers();
      };

      document
        .querySelector(".range-input")
        ?.addEventListener("input", handleRadiusChangeAndFetch);

      return () => {
        document
          .querySelector(".range-input")
          ?.removeEventListener("input", handleRadiusChangeAndFetch);
      };
    }
  }, [location, radius]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery, map!); // Use optional chaining here
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [searchQuery, handleSearch, map]);

  return (
    <div>
      <div id="map" className="h-screen"></div>
      <div className="w-full h-[3.5rem]  absolute top-5 left-0 flex justify-between align-center py-1 px-3">
        <div className="w-[25rem]">
          {/* <input
            className="w-full h-full px-2 range-input"
            type="range"
            placeholder="Enter location name to find trainer"
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            value={radius}
          /> */}
        </div>
        <div className="w-[25rem] bg-white border border-black rounded-full flex overflow-hidden">
          <input
            className="w-full h-full text-center outline-none rounded-full px-2"
            type="search"
            placeholder="Enter location name to find trainer"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <div className="border">
            <select
              className="h-full border border-black text-center outline-none border-none"
              onChange={(e) => setRadius(parseFloat(e.target.value))}
            >
              <option value="">Radius</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        {/* <div>
          <button onClick={handleLogout}>Logout</button>
        </div> */}
        <div className="mt-1">
          <button
            className="w-[200px] py-2 border border-black rounded bg-black text-white hover:bg-white hover:text-black"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {/* <div className="w-full h-[3rem] absolute bottom-5 left-0 "></div> */}
    </div>
  );
};

export default Map;
