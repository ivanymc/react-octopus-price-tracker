import { useState, useEffect } from 'react';

const PERIOD_FROM = new Date().toISOString();

const CurrentProductPrice = ( { onCurrentPlanElectricityPrice, electricityProductCode, electricityTariffCode, gasProductCode, gasTariffCode} ) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (electricityProductCode && electricityTariffCode) {
          // const electricityAPI_ENDPOINT = `https://api.octopus.energy/v1/products/${electricityProductCode}/electricity-tariffs/${electricityTariffCode}/standard-unit-rates/?period_from=${PERIOD_FROM}`;
          const electricityAPI_ENDPOINT = `https://api.octopus.energy/v1/products/${electricityProductCode}/electricity-tariffs/${electricityTariffCode}/standard-unit-rates`;
          console.log("ivan electricityAPI_ENDPOINT", electricityAPI_ENDPOINT);
          const electricityResponse = await fetch(electricityAPI_ENDPOINT);
          if (!electricityResponse.ok) throw new Error(`Error fetching electricity: ${electricityResponse.statusText}`);
          const electricityData = await electricityResponse.json();
          console.log("ivan current electricity product price", electricityData);

          const currentDayElectricity = electricityData.results.find( rate => {
            const validFrom = new Date(rate.valid_from).toISOString();
            const validTo = new Date(rate.valid_to).toISOString();
            return PERIOD_FROM >= validFrom && PERIOD_FROM <= validTo
          });
          const currentDayElectricityPrice = currentDayElectricity?.value_inc_vat || null;
          console.log("PERIOD_FROM", PERIOD_FROM);
          console.log("currentDayElectricityPrice", currentDayElectricityPrice);
          onCurrentPlanElectricityPrice(currentDayElectricityPrice);
        }

        // Fetch gas data if available
        if (gasProductCode && gasTariffCode) {
          const gasAPI_ENDPOINT = `https://api.octopus.energy/v1/products/${gasProductCode}/gas-tariffs/${gasTariffCode}/standard-unit-rates/`;
          const gasResponse = await fetch(gasAPI_ENDPOINT);
          if (!gasResponse.ok) throw new Error(`Error fetching gas: ${gasResponse.statusText}`);
          const gasData = await gasResponse.json();
          // console.log("ivan current gas product price", gasData);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <> 
      
    </>
  );
};

export default CurrentProductPrice;
