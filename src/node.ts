export default class Node<DataType> {
    readonly _id: number
    _data: DataType;
    _neighbors: [Node<DataType>, number][];
    
    constructor(id: number, data: DataType) {
        this._data = data;
    }

    /* Get the degree of the current node  */
    degree = (): number => this._neighbors.length;
    
    /* Add an edge to neighbors */
    addEdge = (toAdd: Node<DataType>, weight: number): void => {
        this._neighbors.push([toAdd, weight]);
    }

    /* Remove an edge from neighbors */
    removeEdge = (toRemove: Node<DataType>): boolean => {
        for (let i = 0; i < this._neighbors.length; i++) {
            if (this._neighbors[i][0] == toRemove) {
                this._neighbors.splice(i, 1);
                return true; 
            }
        }
        return false;
    }
    
    get neighbors() {
        return this._neighbors;
    }
}