import { useEffect, useState } from 'react';

const useFetch = <T>(callback: () => Promise<T>, initialValue: T) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<Error | null>();
  const [fetchedData, setFetchedData] = useState<T>(initialValue);

  useEffect(() => {
    setIsLoading(true);
    callback()
      .then((data) => {
        setFetchedData(data);
      })
      .catch((error) => {
        setErrorState({
          name: callback.name + 'Error',
          message: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [callback]);

  return { isLoading, errorState, setErrorState, fetchedData, setFetchedData };
};

export default useFetch;
