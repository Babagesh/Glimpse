import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EXIF from 'exif-js';
import { gapi } from 'gapi-script';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const MyComponent = () => {
  const [location, setLocation] = useState(defaultCenter);
  const [markerIcon, setMarkerIcon] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: 'AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs',
        clientId: '144372321889-hp8qpnljq6kjdr20au827pfv7rvbv3kb.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
        discoveryDocs: ['https://photoslibrary.googleapis.com/$discovery/rest?version=v1'],
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.isSignedIn.listen(setIsSignedIn);
        setIsSignedIn(authInstance.isSignedIn.get());
        if (authInstance.isSignedIn.get()) {
          loadPhotos();
        }
      });
    }
    gapi.load('client:auth2', start);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setPhotos([]);
  };

  const loadPhotos = () => {
    gapi.client.photoslibrary.mediaItems.list({
      pageSize: 10,
    }).then(response => {
      setPhotos(response.result.mediaItems);
    });
  };

  const handlePhotoClick = (photo) => {
    setMarkerIcon(photo.baseUrl);

    // Use EXIF.js to extract location data if available
    fetch(photo.baseUrl)
      .then(response => response.blob())
      .then(blob => {
        EXIF.getData(blob, function() {
          const latitude = EXIF.getTag(this, 'GPSLatitude');
          const longitude = EXIF.getTag(this, 'GPSLongitude');
          const latRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N';
          const lonRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W';

          const lat = convertDMSToDD(latitude, latRef);
          const lng = convertDMSToDD(longitude, lonRef);
          setLocation({ lat, lng });
        });
      });
  };

  const convertDMSToDD = (dms, ref) => {
    if (!dms) return null;
    const degrees = dms[0] + dms[1] / 60 + dms[2] / 3600;
    return (ref === 'S' || ref === 'W') ? -degrees : degrees;
  };

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <button onClick={handleSignOut}>Sign out</button>
      )}

      <LoadScript googleMapsApiKey="YOUR_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={5}
        >
          {markerIcon && (
            <Marker
              position={location}
              icon={{
                url: markerIcon,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div>
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.baseUrl}
            alt={photo.filename}
            style={{ width: 100, height: 100, cursor: 'pointer' }}
            onClick={() => handlePhotoClick(photo)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyComponent;
