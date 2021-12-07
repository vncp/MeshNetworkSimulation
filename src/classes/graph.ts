import Node from './node';

/*
* This class is responsible for building the graph representation through code.
* Does not build the actual visualization.
*
*/

export default class Graph<DataType> {
  _nodes: Map<string, Node<DataType>>;
  
  constructor() {
    this._nodes = new Map<string, Node<DataType>>();
  }
  
  //Getter for a node
  getNode(id: string): Node<DataType> | undefined {
    return this._nodes.get(id);
  }

  //Setter for a node
  setNode(node: Node<DataType>) {
    this._nodes.set(node._id, node);
  }
  
  //Sets vertex for node
  setVertex(id: string, data: DataType) {
    this._nodes.set(id, new Node(id, data));
  }
  
  //Sets an edge from a node to another
  setEdge(from: string, to: string, weight: number) {
    let fromNode = this._nodes.get(from);
    let toNode = this._nodes.get(to);
    if (fromNode && toNode) {
      fromNode.setEdge(to, weight);
      toNode.setEdge(from, weight);
    }
  }
  
  //Remove edge between nodes
  removeEdge(from: string, to: string) {
    let fromNode = this._nodes.get(from);
    let toNode = this._nodes.get(from);
    if (fromNode && toNode) {
      fromNode.removeEdge(to);
      toNode.removeEdge(from);
    }
  }
  
  //Update an edge
  updateEdge(from: string, to: string, weight: number) {
    let fromNode = this._nodes.get(from);
    let toNode = this._nodes.get(to);
    if (fromNode && toNode) {
      fromNode.setEdge(to, weight);
      toNode.setEdge(from, weight);
    }
  }
  
  // A standard BFS used as a helper for many graph functionalities.
  bfs(start: string, func: (node: Node<DataType>) => void) {
    let seen = new Map<string, boolean>();
    let queue: string[] = [];
    queue.push(start);
    seen.set(start, true);
    while(queue.length !== 0) {
      let currId = queue.shift();
      if (currId === undefined) 
        continue;
      seen.set(currId, true);
      let curr = this._nodes.get(currId);
      if (curr === undefined)
        continue;
      func(curr);
      curr._neighbors.forEach((weight, id) => {
        if (id === undefined) {
          return;
        }
        if (seen.get(id) === undefined)
          queue.push(id);
      });
    }
  }
}
