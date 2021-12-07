import './App.css';
import NetworkGraph, { NetworkData } from './classes/network';

function App() {
  
  /*
  * Graph Data
  */
  const graphData: NetworkData = {
  nodes: [
    {
      "id": "192.168.1.9",
      "neighbors": ["192.168.1.28", "192.168.1.14"],
    },
    {
      "id": "192.168.1.14",
      "neighbors": ["192.168.1.9"],
    },
    {
      "id": "192.168.1.28",
      "neighbors": ["192.168.1.9"],
    },
    {
      "id": "192.168.1.166",
      "neighbors": ["192.168.1.14", "192.168.1.28"],
    }
  ],
  links: [
    {
      "propDelay": 205,
      "source": "192.168.1.9",
      "target": "192.168.1.14",
      "transferring": false
    },
    {
      "propDelay": 124,
      "source": "192.168.1.9",
      "target": "192.168.1.28",
      "transferring": false
    },
    {
      "propDelay": 52,
      "source": "192.168.1.166",
      "target": "192.168.1.28",
      "transferring": false
    },
    {
      "propDelay": 95,
      "source": "192.168.1.14",
      "target": "192.168.1.166",
      "transferring": true
    }
  ]
  };
  return (
    <div className="App">
      <NetworkGraph gData={graphData} />
    </div>
  );
}

export default App;