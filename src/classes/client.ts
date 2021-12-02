import File from './file';
import Node from './node';

export default class Client {
    readonly _id: number;
    _name: string;
    _file: File;
    _currentConnectionID: number | null;
    _uploadSpeed: number;
    _downloadSpeed: number;
    _packetMaxSize: number;
    _bufferSize: number = 1000000; // Bytes
    _bandwidth: number;

    constructor(id: number, file: File,  name?: string) {
        this._id = id;
        if (name)
            this._name = name;
        else
            this._name = id.toString();
        this._file = file;
        this._currentConnectionID = null;
        this._uploadSpeed = 100000 + Math.random() * 9000000; // Bytes
        this._downloadSpeed = 200000 + Math.random() * 1800000; // Bytes
        this._packetMaxSize = 1400; // Bytes
        this._bandwidth = 125000000; // Bytes/sec
    }
    
    initialize(client: Node<Client>) {
        let RTTs = this.getNeighborRTTs(client);
        let RTTsum = 0;
        for (let i = 0; i < RTTs.length; i++) {
            RTTsum += RTTs[i]['RTT'];
        }
        let RTTavg = RTTsum / RTTs.length;
        this._bufferSize = (RTTavg / 1000) * this._bandwidth; // Bytes
    }
    
    getNeighborRTTs(client: Node<Client>): Array<{peerID: number, RTT: number}> {
        let neighborRTTs: Array<{peerID: number, RTT: number}> = [];
        client._neighbors.forEach((RTT, id) => {
            neighborRTTs.push({peerID: id, RTT: RTT});
        });
        return neighborRTTs;
    }
    
    getIncompleteSegment(): number {
        let candidate: number;
        do {
            candidate = Math.floor(Math.random() * this._file._maxsize);
        } while (this._file._segments[candidate] === true);
        return candidate;
    }
    
    getRarestSegment(node: Node<Client>, clients: Map<number, Client>): number {
        let neighborSegments = this.getNeighborSegments(node, clients);
        let availableCount: number[] = [];
        availableCount.length = this._file._maxsize;
        availableCount.fill(0, 0, availableCount.length);
        for (let i = 0; i < availableCount.length; i++) {
            if (this._file._segments[i] === false) {
                for (let n = 0; n < neighborSegments.length; n++) {
                    const {segments} = neighborSegments[n];
                    if (segments[i] === true)
                        availableCount[i]++;
                }
            }
        }
        let min = Number.MAX_SAFE_INTEGER;
        let minSegmentIdx: number = NaN;
        // 0 means no neighbor has it or we have it
        for (let i = 0; i < availableCount.length; i++) {
            if (availableCount[i] !== 0 || availableCount[i] < min) {
                min = availableCount[i];
                minSegmentIdx = i;
            }
        }
        return minSegmentIdx;
    }
    
    private getNeighborSegments(node: Node<Client>, clients: Map<number, Client>): Array<{peerID: number, segments: boolean[]}>
         {
        let neighborStatus: {peerID: number, segments: boolean[]}[] = [];
        node._neighbors.forEach((weight, id) => {
            let client = clients.get(id);
            if (client === undefined)
                return;
            neighborStatus.push({peerID: id, segments: client._file._segments});
        });
        return neighborStatus;
    }

    getNeighborDelays(node: Node<Client>): Array<{peerID: number, delay: number}> {
        let neighborDelays: {peerID: number, delay: number}[] = [];
        node._neighbors.forEach((delay, id) => {
            neighborDelays.push({peerID: id, delay: delay})
        });
        return neighborDelays;
    }
    

    
    
}