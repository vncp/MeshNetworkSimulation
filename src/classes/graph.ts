import Node from './node';

export default class Graph<DataType> {
  _nodes: Map<string, Node<DataType>>;
  
  constructor() {
    this._nodes = new Map<string, Node<DataType>>();
  }
  
  getNode(id: string): Node<DataType> | undefined {
    return this._nodes.get(id);
  }

  setNode(node: Node<DataType>) {
    this._nodes.set(node._id, node);
  }
  

  setVertex(id: string, data: DataType) {
    this._nodes.set(id, new Node(id, data));
  }
  
  setEdge(from: string, to: string, weight: number) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.setEdge(to, weight);
  }
  
  removeEdge(from: string, to: string) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.removeEdge(to);
  }
  
  updateEdge(from: string, to: string, weight: number) {
    let fromNode = this._nodes.get(from);
    if (fromNode != null)
      fromNode.setEdge(to, weight);
  }
  
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
