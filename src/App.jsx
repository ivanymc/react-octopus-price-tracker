import { useState } from 'react';

import AgilePrice from './component/AgilePrice'
import AccountDetails from './component/AccountDetails'
import CurrentProductPrice from './component/CurrentProductPrice';
import Consumption from './Consumption';

function App() {

  const [electricityProductCode, setElectricityProductCode] = useState("");
  const [electricityTariffCode, setElectricityTariffCode] = useState("");
  const [gasProductCode, setGasProductCode] = useState("");
  const [gasTariffCode, setGasTariffCode] = useState("");
  const [areacode, setAreaCode] = useState("");

  const [electricityMeter, setElectricityMeter] = useState("");
  const [gasMeter, setGasMeter] = useState("");

  const [currentPlanElectricityPrice, setCurrentPlanElectricityPrice] = useState("");

  return (
    <>
      <div className="px-20">
        <AccountDetails 
          onElectricityProductCode={setElectricityProductCode}
          onElectricityTariffCode={setElectricityTariffCode}
          onGasProductCode={setGasProductCode}
          onGasTariffCode={setGasTariffCode}
          onAreaCode={setAreaCode}
          onElectricityMeter={setElectricityMeter}
          onGasMeter={setGasMeter}
        />

        { electricityProductCode && gasProductCode &&
          <CurrentProductPrice 
            onCurrentPlanElectricityPrice={setCurrentPlanElectricityPrice}
            electricityProductCode={electricityProductCode}
            electricityTariffCode={electricityTariffCode}
            gasProductCode={gasProductCode}
            gasTariffCode={gasTariffCode} />
        }

        { areacode && currentPlanElectricityPrice &&
            <AgilePrice areacode={areacode} currentPlanElectricityPrice={currentPlanElectricityPrice} />
        }

        { electricityMeter && gasMeter &&
          <Consumption electricityMeter={electricityMeter} gasMeter={gasMeter} />
        }
      </div>
    </>
  )
}

export default App
