import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import {fetchUserPlaces, updatingUserPlaces} from './http.js';
import Error from './components/Error.jsx';

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[isFetching,setIsFetching] = useState(false);//loading state
  const[error,setError]=useState()//error state
  const[errorUpdatingPlaces,setErrorUpdationgPlaces] = useState()
  useEffect(()=>{
    async function fetchPlaces(){
      setIsFetching(true)
      try{
        const places = await fetchUserPlaces();
        setUserPlaces(places)
      }catch(error){
        setError({message:error.message||'failed to fetch user places'})
        
      }
      setIsFetching(false)
    }
    fetchPlaces()
  },[])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

 async function handleSelectPlace(selectedPlace) {
  // await updatingUserPlaces([selectedPlace,...userPlaces])

    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try{
      await updatingUserPlaces([selectedPlace,...userPlaces])


    }catch(error){
      setUserPlaces(userPlaces)//here userplaces is old user places
      setErrorUpdationgPlaces({message:error.message ||'failed to update places'})
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );
    //delete
    try{
      updatingUserPlaces(userPlaces.filter(place=>place.id!==selectedPlace.current.id))


    }catch(error){
      setUserPlaces(userPlaces);
      errorUpdatingPlaces({message:error.message ||'failed to delete place'})

    }

    setModalIsOpen(false);
  }, [userPlaces]);
  function handleError(){
    setErrorUpdationgPlaces(null)//to clear the error
  }
  return (
    <>
    <Modal open={errorUpdatingPlaces}>
      {errorUpdatingPlaces && <Error title='an error occured' message={errorUpdatingPlaces.message}
      onConfirm={handleError}onClose={handleError}/>}
    </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title='an error occured'message={error.message}/>}
        {!error &&<Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          isLoading={isFetching}
          loadingText='Fetching your places...'
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
