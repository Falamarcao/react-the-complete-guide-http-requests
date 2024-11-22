import { useCallback, useRef, useState } from 'react';

import logoImg from './assets/logo.png';

import AvailablePlaces from './components/AvailablePlaces';
import DeleteConfirmation from './components/DeleteConfirmation';
import ErrorPage from './components/ErrorPage';
import Modal from './components/Modal';
import Places from './components/Places';

import useFetch from './hooks/useFetch';

import { Place } from './models/Place';

import { PlacesService } from './services/PlacesService';

const placesService = PlacesService.getInstance();

function App() {
  const selectedPlace = useRef<Place>();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const {
    isLoading,
    errorState: placesServiceError,
    setErrorState,
    fetchedData: userPlaces,
    setFetchedData: setUserPlaces,
  } = useFetch<Place[]>(placesService.getUserPlaces, []);

  function handleStartRemovePlace(place: Place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace: Place) {
    setUserPlaces((prevPickedPlaces: Place[]) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    await placesService
      .updateUserPlaces([selectedPlace, ...userPlaces])
      .catch((error) => {
        setUserPlaces(userPlaces); // if exception -> rollback changes
        setErrorState({
          name: 'UpdateUserPlacesError',
          message: error.message,
        });
      });
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces: Place[]) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace?.current?.id
        )
      );

      await placesService
        .updateUserPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace?.current?.id)
        )
        .catch((error) => {
          setUserPlaces(userPlaces); // if exception -> rollback changes
          setErrorState({
            name: 'RemoveUserPlacesError',
            message: error.message,
          });
        });

      setModalIsOpen(false);
    },
    [userPlaces, setUserPlaces, setErrorState]
  );

  const handleError = () => {
    setErrorState(null);
  };

  return (
    <>
      <Modal open={Boolean(placesServiceError)} onClose={handleError}>
        <ErrorPage
          title="An error occurred!"
          message={placesServiceError?.message}
          onConfirm={handleError}
        />
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
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isLoading}
          loadingText="Fetching selected places..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
