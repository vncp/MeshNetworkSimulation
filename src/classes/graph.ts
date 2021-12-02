import Node from './node';

export default class Graph<DataType> {
  _nodes: Map<number, Node<DataType>>;
  
  constructor() {
    this._nodes = new Map<number, Node<DataType>>();
  }
  
  getNode(id: number): Node<DataType> | undefined {
    return this._nodes.get(id);
  }

  setNode(node: Node<DataType>) {
    this._nodes.set(node._id, node);
  }
  

  addVertex(id: number, data: DataType) {
    this._nodes.set(id, new Node(id, data));
  }
  
  setEdge(from: number, to: number, weight: number) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.setEdge(to, weight);
  }
  
  removeEdge(from: number, to: number) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.removeEdge(to);
  }
  
  updateEdge(from: number, to: number, weight: number) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.setEdge(to, weight);
  }
  
  bfs(start: number, func: (node: Node<DataType>) => void) {
    let seen = new Map<number, boolean>();
    let queue: number[] = [];
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
