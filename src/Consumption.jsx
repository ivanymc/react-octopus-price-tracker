import { useState, useEffect } from 'react';


const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  return `${hours}:${minutes} ${day}/${month}`; // e.g., "21:00 16/10"
  // return `${hours}:${minutes}`; // e.g., "21:00 16/10"
};


const Consumption = ( { electricityMeter, gasMeter }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consumptionData, setConsumptionData] = useState([]);

  const MPAN = electricityMeter.mpan;
  const SERIAL_NUMBER = electricityMeter.serial_number;
  const API_ENDPOINT = ` https://api.octopus.energy/v1/electricity-meter-points/${MPAN}/meters/${SERIAL_NUMBER}/consumption/`;
  // const API_ENDPOINT = `https://api.octopus.energy/v1/products/${PRODUCT_CODE}/electricity-tariffs/${TARIFF_CODE}/standard-unit-rates/?period_from=${PERIOD_FROM}`;
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          headers: {
            'Authorization': `Basic ${btoa(`${apiKey}:`)}`
          }
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`); 
        const data = await response.json();
        console.log("ivan electricity consumption", data);

        setConsumptionData(data.results);
        
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <> 
      <div>
        <h3>Electricity Meter:</h3>
        <p>Serial Number: {electricityMeter.serial_number}</p>
        <p>MPAN: {electricityMeter.mpan}</p>

        <h3>Gas Meter:</h3>
        <p>Serial Number: {gasMeter.serial_number}</p>
        <p>MPRN: {gasMeter.mpan}</p>

        {/* Table for consumption data */}
        <h3>Consumption Data:</h3>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Time Interval</th>
              <th className="border border-gray-300 px-4 py-2">Consumption (kWh)</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {consumptionData && consumptionData.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{formatDateTime(item.interval_start)}</td>
                <td className="border border-gray-300 px-4 py-2">{item.consumption} kWh</td>
                <td className="border border-gray-300 px-4 py-2">{item.price} £</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

};

export default Consumption;
