import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { styles } from "./styles";
import * as Location from "expo-location";
import { useEffect, useState , useRef} from "react";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestForegroundPermissions() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      let currentPosition = await Location.getCurrentPositionAsync();
      setLocation(currentPosition);
      //console.log("LOCALIZAÇÃO ATUAL => ", currentPosition);
    }
  }

  useEffect(() => {
    requestForegroundPermissions();
  }, []);

  useEffect(() => {
    Location.watchPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    });
  }, [])

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker 
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
