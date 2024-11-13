import { useCallback, useRef, useState } from 'react';

import logoImg from './assets/logo.png';

import AvailablePlaces from './components/AvailablePlaces';
import DeleteConfirmation from './components/DeleteConfirmation';
import Modal from './components/Modal';
import Places from './components/Places';

import { Place } from './models/Place';

function App() {
  const selectedPlace = useRef<Place>();

  const [userPlaces, setUserPlaces] = useState<Place[]>([]);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  function handleStartRemovePlace(place: Place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(selectedPlace: Place) {
    setUserPlaces((prevPickedPlaces: Place[]) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces: Place[]) =>
      prevPickedPlaces.filter(
        (place) => place.id !== selectedPlace?.current?.id
      )
    );

    setModalIsOpen(false);
  }, []);

  return (
    <>
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
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
