import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import Error from './Error.jsx';
import {sortPlacesByDistance} from '../loc.js';
import {fetchAvailablePlaces}from '../http.js'

export default function AvailablePlaces({ onSelectPlace }) {
  const[availablePlaces,setAvailablePlaces] = useState([]);//data state
  const[isFetching,setIsFetching] = useState(false);//loading state
  const[error,setError]=useState()//error state
  useEffect(()=>{
    setIsFetching(true)//data is started to fetching
    async function fetchPlaces(){
     
     //error handling
     try{
    //   const response =  await  fetch('http://localhost:3000/places');
    //  const resData = await response.json();
    //  if(!response.ok){
    //   throw new Error ('failed to fetch')
    // }
    //calculate the location distance
    const places = await  fetchAvailablePlaces()
  navigator.geolocation.getCurrentPosition((position)=>{
    // const sortedPlaces = sortPlacesByDistance(resData.places,position.coords.latitude,position.coords.longitude)
    const sortedPlaces = sortPlacesByDistance(places,position.coords.latitude,position.coords.longitude)
    setAvailablePlaces(sortedPlaces);
    setIsFetching(false)// ended fetching data


  })

     }catch(error){
      setError({message:error.message ||'could not fetch data. please try again later'})

      setIsFetching(false)// ended fetching data

     }

     
     
    }
    fetchPlaces()
    
  },[])
  if(error){
    return <Error title='an error occured' message={error.message}/>

  }
  
  
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText = 'Fetching place data ...'
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
