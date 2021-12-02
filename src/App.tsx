import './App.css';
import NetworkGraph, { NetworkData } from './classes/network';

function App() {
  const graphData: NetworkData = {
  nodes: [
    {
      "id": "192.168.1.9",
      "neighbors": ["192.168.1.28", "192.168.1.14"],
      "x": 15,
      "y": 10
    },
    {
      "id": "192.168.1.14",
      "neighbors": ["192.168.1.9"],
      "x": 10,
      "y": 15
    },
    {
      "id": "192.168.1.28",
      "neighbors": ["192.168.1.9"],
      "x": 15,
      "y": 10
    },
    {
      "id": "192.168.1.166",
      "neighbors": ["192.168.1.14", "192.168.1.28"],
      "x": 12,
      "y": 16
    }
  ],
  links: [
    {
      "RTT": 124,
      "source": "192.168.1.9",
      "target": "192.168.1.14",
      "transferring": false
    },
    {
      "RTT": 124,
      "source": "192.168.1.9",
      "target": "192.168.1.28",
      "transferring": true
    },
    {
      "RTT": 52,
      "source": "192.168.1.166",
      "target": "192.168.1.28",
      "transferring": true
    },
    {
      "RTT": 95,
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