export const fetchJsonWithReject = (url, config, attempts = 0) => {
  return fetch(url, config)
    .then (response => {
      if (!response.ok){
        throw response;
      }
      return response.json();
    })
    .catch(async (error) => {
      // Try to return proper error message from both caught promises and Error objects
      try {
        if(error.status === 429 && attempts < 10){
          await delay(random(100, 750) + (attempts * 100));
          return await fetchJsonWithReject<T>(url, config, attempts + 1);
        }
        return error.json().then((response) => {
          throw response;
        });
      }
      catch (e) {
        throw error;
      }
    });
}

export const sortArrayOfObjectsByStringProperty = (arrayToSort, stringProperty) => {
  return arrayToSort.sort((a, b) => {
    const valueA = a[stringProperty]?.toLowerCase() || '';
    const valueB = b[stringProperty]?.toLowerCase() || '';

    return valueA.localeCompare(valueB);
  });
}
