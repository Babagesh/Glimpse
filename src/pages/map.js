/*function initMap(){
    map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
    mapId: '11659132972ddeaa'
    });
}*/

import React from "react"
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps'

export default function Login() {
    const position = {lat: 61.2176, lng: -149.8997};
    return (
        <div>
            <APIProvider apiKey={'AIzaSyAAhPJobn3qsBMYDInmeZXhJN-KZPp0oDs'}>
            <Map center={position} zoom={10}>
                <Marker position={position} />
            </Map>
            </APIProvider>
        </div>
    );
}
