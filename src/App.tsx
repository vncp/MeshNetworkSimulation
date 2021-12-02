import logo from './logo.svg';
import './App.css';
import Graph from './classes/graph';
import File from './classes/file';
import Client from './classes/client';

function App() {
  let graph = new Graph<Client>();
  let clients = new Map<number, Client>();
  let fileASize = 512;
  for (let i = 0; i < 10; i++) {
    let client = new Client(i+1, new File(fileASize), String.fromCharCode(65 + i));
    clients.set(i+1, client);
    graph.addVertex(i+1, client);
  }
  for (let i = 0; i < 10 - 1; i++) {
    graph.setEdge(i, i+1, 35 + Math.floor(Math.random() * 265));
  }
  
  graph.bfs(1, (node) => {
    console.log(node._data);
  });


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
