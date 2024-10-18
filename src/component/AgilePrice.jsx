import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';


const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  return `${hours}:${minutes} ${day}/${month}`; // e.g., "21:00 16/10"
  // return `${hours}:${minutes}`; // e.g., "21:00 16/10"
};


const AgilePrice = ( {areacode, currentPlanElectricityPrice }) => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const PRODUCT_CODE = "AGILE-FLEX-22-11-25";
  const TARIFF_CODE = `E-1R-AGILE-FLEX-22-11-25-${areacode}`;
  const PERIOD_FROM = new Date().toISOString();
  const API_ENDPOINT = `https://api.octopus.energy/v1/products/${PRODUCT_CODE}/electricity-tariffs/${TARIFF_CODE}/standard-unit-rates`;
  // const API_ENDPOINT = `https://api.octopus.energy/v1/products/${PRODUCT_CODE}/electricity-tariffs/${TARIFF_CODE}/standard-unit-rates/?period_from=${PERIOD_FROM}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          // headers: { 'Authorization': `Bearer ${API_KEY}` }
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`); 
        const data = await response.json();
        console.log("ivan agile data", data);

        const formattedData = data.results
          .map(item => ({
            time: new Date(item.valid_from).toISOString(), 
            timeFormatted: formatDateTime(item.valid_from), 
            price: item.value_inc_vat
          }))
          .sort((a, b) => new Date(a.time) - new Date(b.time));

        console.log("ivan agile formattedData", formattedData);
        console.log("ivan currentPlanElectricityPrice", currentPlanElectricityPrice);

        // // For test
        // formattedData.push({
        //   "price": 90,
        //   "time": "2022-11-25T14:00:00Z",
        //   "timeFormatted": "14:00 25/11"
        // })

        setPriceData(formattedData);
        
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
      <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Agile Price v.s. Current Plan</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis dataKey="price" />
          <XAxis dataKey="timeFormatted"/>
          <Tooltip />
          <Legend />
          <Line type="linear" dataKey="price" stroke="#8884d8" />
          <ReferenceLine y={currentPlanElectricityPrice} stroke="red" strokeDasharray="3 " label="Current Electricity Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </>
  );
};

export default AgilePrice;
