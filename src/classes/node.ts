
/*
* A basic generic node in a graph
*/

export default class Node<DataType> {
    readonly _id: string;
    _data: DataType;
    // NeighborID, Weight
    _neighbors: Map<string, number>;
    
    constructor(id: string, data: DataType) {
        this._id = id;
        this._data = data;
        this._neighbors = new Map<string, number>(); // id, weight
    }

    /* Get the degree of the current node  */
    degree = (): number => this._neighbors.size;
    
    /* Add an edge to neighbors */
    setEdge = (to: string, weight: number): void => {
        this._neighbors.set(to, weight);
    }

    /* Remove an edge from neighbors */
    removeEdge = (toRemove: string): boolean => {
        return this._neighbors.delete(toRemove);
    }
    
    // Returns the neighbors of the individual node; Determined by edges
    get neighbors() {
        return this._neighbors;
    }
}