import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./app.css"
import TimeAgo from 'timeago-react';
// import { format } from "timeago.js";
import axios from 'axios';

function App() {
  const currentUser = 'jane'
  const [viewport, setViewport] = useState({
    width: "100vw", 
    height: "100vh"
  })
  const [pins, setPins] = useState([]);
  //open just one pin
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/pins');
        //console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins()
  },[])

  const handleMarkerClick = (id, lat, long ) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude: long});
  };

  const handleAddClick = (e) => {
    console.log(e);
    const {lat, lng} = e.lngLat;
    console.log(lat, lng);
    setNewPlace({
      lat: lat,
      long: lng,
    })
  }

  return (
    <div className="App">

      <Map
        initialViewState={{
          latitude: 43,
          longitude: 25,
          zoom: 4
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick = {handleAddClick}
      >

      {pins.map((p) => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              // color="red"
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room
                style={{
                  fontSize: viewport.zoom*8,
                  color: p.username === currentUser ? "green" : "red",
                  cursor: "pointer",
                }}

              onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>

            {p._id === currentPlaceId && (

            <Popup 
              longitude={p.long} 
              latitude={p.lat} 
              
              anchor="left"
              onClose={()=> setCurrentPlaceId(null)}
            >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{p.title}</h4>
               <label>Review</label>
              <p className="description">{p.desc}</p>
              <label>Rating</label>
              <div className="stars">
                <Star className='star'/>
                <Star className='star'/>
                <Star className='star'/>
                <Star className='star'/>
                <Star className='star'/>
              </div>
              <label>Information</label>
             <span className="username">Created by <b>{p.username}</b></span>
              <span className="date">
                <TimeAgo
                datetime={p.createdAt}
                />
              </span>
            </div>
          </Popup>
          )}
         </>
        ))}

        {newPlace && (
          <Popup 
            longitude={newPlace.long} 
            latitude={newPlace.lat} 
            anchor="left"
            onClose={()=> setNewPlace(null)}
            >
                hello
            </Popup>
            )}
      </Map>
    </div>
  );
}

export default App;
