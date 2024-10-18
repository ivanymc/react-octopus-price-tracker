import { useState } from 'react';

const AccountDetails = ({ onElectricityProductCode, onElectricityTariffCode, onGasProductCode, onGasTariffCode, onAreaCode, onElectricityMeter, onGasMeter }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!accountNumber || !apiKey) {
      setError('Please provide both account number and API key.');
      return;
    }

    setLoading(true);
    setError(null);

    const API_ENDPOINT = `https://api.octopus.energy/v1/accounts/${accountNumber}`;

    try {
      const response = await fetch(API_ENDPOINT, {
        headers: {
          'Authorization': `Basic ${btoa(`${apiKey}:`)}`
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log("ivan account details", data);

      const electricity_agreements = data.properties[0].electricity_meter_points[0].agreements;
      const electricity_agreement_length = electricity_agreements.length;
      const electricity_tariff_code = electricity_agreements[electricity_agreement_length - 1].tariff_code;
      const gas_agreements = data.properties[0].gas_meter_points[0].agreements;
      const gas_agreement_length = gas_agreements.length;
      const gas_tariff_code = gas_agreements[gas_agreement_length - 1].tariff_code;

      const area_code = electricity_tariff_code.slice(-1);
      const cleaned_electricity_tariff_code = electricity_tariff_code.split('-').slice(2, -1).join('-');
      const cleaned_gas_tariff_code = gas_tariff_code.split('-').slice(2, -1).join('-');

      const electricity_meter = {
        "serial_number": data.properties[0].electricity_meter_points[0].meters[0].serial_number,
        "mpan": data.properties[0].electricity_meter_points[0].mpan
      }

      const gas_meter = {
        "serial_number": data.properties[0].gas_meter_points[0].meters[0].serial_number,
        "mpan": data.properties[0].gas_meter_points[0].mprn
      }

      // console.log("electricity_meter", electricity_meter);
      // console.log("gas_meter", gas_meter);

      onElectricityProductCode(cleaned_electricity_tariff_code);
      onElectricityTariffCode(electricity_tariff_code);
      onGasProductCode(cleaned_gas_tariff_code);
      onGasTariffCode(gas_tariff_code);
      onAreaCode(area_code);
      onElectricityMeter(electricity_meter);
      onGasMeter(gas_meter);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <h2 className="text-2xl font-bold mb-4 col-span-5">Search Account Details
        <a href="https://octopus.energy/dashboard/new/accounts/personal-details/api-access"
          target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline ml-4" >
          Get your API key from the Octopus Dashboard
        </a>
      </h2>
  
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Account Number:</label>
        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
  
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">API Key:</label>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
  
      <div className="col-span-1 flex items-end">
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" >
          Search
        </button>
      </div>
  
      {loading && <div className="col-span-3">Loading...</div>}
      {error && <div className="col-span-3 text-red-500">{error}</div>}
  
      <div className="col-span-3 mt-4">
        
      </div>
    </div>
  );
  
};

export default AccountDetails;
