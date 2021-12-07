import React, { Component } from "react";
import File from './file';
import Node from './node';
import { NodeData } from './network';

/*
* This class is responsible for defining the properties and functions of each Client.
* A client in the graph is a node.
* Clients are connected to eachother by links.
*/

export default class Client extends Component { 
    readonly _id: string;
    _label: string;
    _file: File;
    _uploadSpeed: number;
    _downloadSpeed: number;
    _packetMaxSize: number;
    _bufferSize: number = 1000000; // Bytes
    _bandwidth: number;
    _latency: number; // total delays for node
    _currentConnectionID: number | null;
    _transferring = false;
    
    constructor(props: NodeData, file: File) {
        super(props);
        this._id = props.id;
        this._label = props.labelOverride || props.id.toString();
        this._file = file;
        this._uploadSpeed = props.uploadSpeed || 100000 + Math.random() * 9000000; // Bytes
        this._downloadSpeed = props.downloadSpeed || 200000 + Math.random() * 1800000; // Bytes
        this._packetMaxSize = props.packetMaxSize || 1400; // Bytes
        this._bandwidth = props.bandwidth || 125000000; // Bytes/sec
        this._latency = props.latency ||  30 + Math.random() * 10; // All delays except propogation (propgation is weight)
        this._currentConnectionID = null;
        this._transferring = true; // todo
    }
    
    initialize(client: Node<Client>) {
        let RTTs = this.getNeighborRTTs(client);
        let RTTsum = 0;
        for (let i = 0; i < RTTs.length; i++) {
            RTTsum += RTTs[i]['RTT'];
        }
        let RTTavg = (RTTsum / RTTs.length);
        this._bufferSize = (RTTavg / 1000) * this._bandwidth; // Bytes
    }
    
    //Round trip time to neighbors
    getNeighborRTTs(client: Node<Client>): Array<{peerID: string, RTT: number}> {
        let neighborRTTs: Array<{peerID: string, RTT: number}> = [];
        client._neighbors.forEach((RTT, id) => {
            neighborRTTs.push({peerID: id, RTT: RTT});
        });
        return neighborRTTs;
    }
    
    /* Gets Random Segment first*/
    getIncompleteSegment(): number {
        let candidate: number;
        do {
            candidate = Math.floor(Math.random() * this._file._maxsize);
        } while (this._file._segments[candidate] === true);
        return candidate;
    }
    
    /* After getting a random segment, the node should grab the rarest segment.*/
    getRarestSegment(node: Node<Client>, clients: Map<string, Client>): number {
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
    
    //Get the current status of neighbor segments:
    //This means which segments of the file a neighboring node has so that they may be downloaded according to rarity.
    private getNeighborSegments(node: Node<Client>, clients: Map<string, Client>): Array<{peerID: string, segments: boolean[]}>
         {
        let neighborStatus: {peerID: string, segments: boolean[]}[] = [];
        node._neighbors.forEach((weight, id) => {
            let client = clients.get(id);
            if (client === undefined)
                return;
            neighborStatus.push({peerID: id, segments: client._file._segments});
        });
        return neighborStatus;
    }

    //Accounts for the delays of neighboring nodes, so that in the final stage can choose best node to download segments from.
    getNeighborDelays(node: Node<Client>): Array<{peerID: string, delay: number}> {
        let neighborDelays: {peerID: string, delay: number}[] = [];
        node._neighbors.forEach((delay, id) => {
            neighborDelays.push({peerID: id, delay: delay})
        });
        return neighborDelays;
    }
}