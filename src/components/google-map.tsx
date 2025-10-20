import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
type MapLocation = {
  lat: number;
  lng: number;
};

type GoogleMapComponentProps = {
  center: MapLocation;
  // position?: MapLocation;
  markers?: MapLocation[];
  handleMapClick: (e: google.maps.MapMouseEvent) => void;
  // locationCurrent: () => void;
  handleClickMarker: (position: MapLocation) => void;
};

const GOOGLE_MAPS_API_KEY = "AIzaSyDMPBInLIMw1I_Y8_psHpVf-FVeD66ONlo";

const containerStyle: React.CSSProperties = {
  height: "100vh",
  width: "100%",
  borderRadius: "10px",
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  center,
  // position,
  markers = [],
  handleMapClick,
  // locationCurrent,
  handleClickMarker,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      options={{
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        draggableCursor: "default",
        draggingCursor: "default",
      }}
      onClick={handleMapClick}
    >
      {/* {position && <Marker position={position} />} */}
      {markers.map((marker, index) => (
        // <Marker key={index} position={marker} />
        <Marker
          key={index}
          position={marker}
          icon={{
            url: "/marker-map.png", // Đường dẫn tới icon tùy chỉnh
            scaledSize: new google.maps.Size(80, 80),
          }}
          onClick={() => handleClickMarker(marker)}
        />
      ))}
      {/* <div style={{ position: "absolute", bottom: 30, right: 10, zIndex: 1 }}>
        <button className="bg-white p-1 rounded" onClick={locationCurrent}>
          <span className="color-red">Current</span>
        </button>
      </div> */}
    </GoogleMap>
  ) : null;
};

export default GoogleMapComponent;
