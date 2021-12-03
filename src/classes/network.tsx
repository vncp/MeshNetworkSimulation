import Graph from './graph';
import Client from "./client";
import File from './file';
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ForceGraph2D from "react-force-graph-2d";
import "./styles.css";
import host_image from '../images/host_blue.png';

export interface NodeData {
    // Node
    id: string, 
    neighbors: string[], 
    labelOverride?: string,
    // Network Data (can be defaulted)
    latency?: number, // non-propDelays
    uploadSpeed?: number, // max
    downloadSpeed?: number, // max
    packetMaxSize?: number, 
    bufferSize?: number, // will be autocalculated based on avgRtt * C, included for read
    bandwidth?: number,
    hasFile?: boolean,
    // Position
    x?: number, 
    y?: number
};

export interface LinkData {
    propDelay: number, 
    source: string, 
    target: string, 
    transferring: boolean
};

export interface NetworkData {
    nodes: NodeData[],
    links: LinkData[]
};

export default function NetworkGraph(props: any) {
    const fgRef = useRef<any>();
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [nodePosition, setNodePosition] = useState<{x: number, y: number}>(null);
    const [stopEngine, setStopEngine] = useState(false);
    const [graphData, setGraphData] = useState<NetworkData>(props.gData);
    const [network, setNetwork] = useState<Network>(new Network());
    
    const setPosition = (pos: {pageX: number, pageY: number}) => {
        setNodePosition({x: pos.pageX, y: pos.pageY});
    }
    
    // Update data based on props
    useEffect(() => {
        network.fromNetworkData(props.gData);
        setGraphData(network.toNetworkData());
    }, [props, network]);

    // Update when graph data changes
    useEffect(() => {
        network.fromNetworkData(graphData);
    }, [graphData]);

    useEffect(() => {
        const loop = setInterval(() => {
            console.log("time");
        }, 500);

        return () => clearInterval(loop);
    });

    return (<div>
        {selectedNode && ReactDOM.createPortal(
            <div
                className="nodeCard"
                style={{
                    position: "absolute",
                    margin: "2px 0px 2px 0px",
                    left: nodePosition?.x + 5,
                    top: nodePosition?.y + 5,
                    border: "2px solid #81A1C1"
                }} 
            >
                <div>
                    <div>IP: {selectedNode.id}</div>
                    <div>Node Delay: {Math.trunc(selectedNode.latency)} ms</div>
                    <div>Rate: {Math.trunc(selectedNode.uploadSpeed)} byte/s UP | {Math.trunc(selectedNode.downloadSpeed)} byte/s DOWN</div>
                    <div>Buffer Size: {selectedNode.bufferSize} bytes</div>
                    {selectedNode._transferring ? <div>Sending to {selectedNode._currentConnectionID}</div> : <div />}
                </div>
            </div>,
            document.body
        )}
        <div>
        <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeId="id"
            autoPauseRedraw={false}
            backgroundColor='#2E3440'
            nodeCanvasObject={(node, ctx) => {
                const img = new Image();
                const size = 15;
                img.src = host_image;
                ctx.drawImage(
                    img,
                    node.x - size / 2,
                    node.y - size / 2,
                    size+1,
                    size
                );

                ctx.beginPath();
                const label = node.id.toString();
                const textWidth = ctx.measureText(label.toString()).width;
                const bgDimensions = [textWidth, 2].map((n) => n + 2);
                ctx.fillStyle = "#434C5EEA";
                ctx.fillRect(
                    node.x - 12,
                    node.y + 6.3,
                    25.8,
                    6
                );
                ctx.font = `3px lato`;
                ctx.textAlign = "center";
                ctx.fillStyle = "#A3BE8C";
                ctx.fillText(label.toString(), node.x + 1.3, node.y + 11.1);

                const delta = network._fileSize / 50;
                for (let i = 0, pixel = 0; i < network._fileSize; i += delta) {
                    if (network._graph.getNode(label)?._data._file._segments[i]) {
                        ctx.fillStyle = "#A3BE8CFF";
                    } else {
                        ctx.fillStyle = "#BF616AFF";
                    }
                    ctx.fillRect(node.x + pixel - 11.5, node.y + 7, 0.3, 1);
                    pixel += 0.5;
                }
                return ctx;
            }}
            linkCurvature={0.15}
            linkDirectionalArrowLength={2}
            linkDirectionalParticles={(link: LinkData) => link?.transferring ? 2 : 0}
            linkDirectionalParticleColor={() => '#00AF00'}
            linkDirectionalParticleSpeed={(link: LinkData) => 1 / link.propDelay}
            linkColor={(link: any) => link?.transferring ? '#A3BE8C' : '#BF616A'}
            linkWidth={1.0}
            onNodeHover={(node) => (node) ? setSelectedNode(node) : setSelectedNode(null) }
            minZoom={1.5}
            maxZoom={10}
            onEngineStop={() => {
                if(!stopEngine) {
                    fgRef.current.zoomToFit(1000, 50);
                    setStopEngine(true);
                }
            }}
            cooldownTicks={100}
        >
        </ForceGraph2D>
        </div>
    </div>);
}

export class Network {
    _graph: Graph<Client>;
    _fileSize = 512; // segments
    static _currentId = 1;

    constructor() {
        this._graph = new Graph<Client>(); 
        this.init();
    }

    fromNetworkData(networkData: NetworkData) {
        networkData.nodes.forEach((node) => {
            let client: Client;
            if(this._graph.getNode(node.id)) {
                client = this._graph.getNode(node.id)._data;
                client._label = node.labelOverride || client._label;
                client._latency = node.latency || client._latency;
                client._uploadSpeed = node.uploadSpeed || client._uploadSpeed;
                client._downloadSpeed = node.downloadSpeed || client._downloadSpeed;
                client._packetMaxSize = node.packetMaxSize || client._packetMaxSize;
                client._bufferSize = node.bufferSize || client._bufferSize;
                client._bandwidth = node.bandwidth || client._bandwidth;
            } else {
                client = new Client(node, new File(this._fileSize));
            }
            this._graph.setVertex(node.id, client);
        });
        networkData.links.forEach((link) => {
            this._graph.setEdge(link.source, link.target, link.propDelay);
        });
    }
    
    toNetworkData(): NetworkData {
        let networkData: NetworkData = {nodes: [], links: []};
        this._graph._nodes.forEach((state, id) => {
            const clientData = this._graph._nodes.get(id)._data;
             
            // Populate neighbor edges
            const clientNeighbors = this._graph.getNode(id)._neighbors;
            let neighborLinks: LinkData[] = [];
            let neighborIDs: string[] = [];
            clientNeighbors.forEach((weight, id) => {
                let neighborData = this._graph.getNode(id)._data;
                neighborLinks.push({
                    "propDelay": (neighborData._latency + clientData._latency),
                    "source": clientData._label,
                    "target": neighborData._label,
                    "transferring": clientData._transferring,
                });
                neighborLinks.push({
                    "propDelay": (neighborData._latency + clientData._latency),
                    "source": neighborData._label,
                    "target": clientData._label,
                    "transferring": clientData._transferring,
                });
                neighborIDs.push(neighborData._label);
            })

            networkData = {
                nodes:  [
                    ...networkData.nodes, 
                    { 
                        "id": clientData._label, 
                        "neighbors":  neighborIDs,
                        "labelOverride": clientData._label ? clientData._label : null,
                        "latency": clientData._latency,
                        "uploadSpeed": clientData._uploadSpeed,
                        "downloadSpeed": clientData._downloadSpeed,
                        "packetMaxSize": clientData._packetMaxSize,
                        "bufferSize": clientData._bufferSize,
                        "bandwidth": clientData._bandwidth
                    }
                ],
                links: [
                    ...networkData.links,
                    ...neighborLinks
                ]
            };
        });
        return networkData;
    }
    
    private init() {
    }

    stepSimulation() {

        
        //One client broadcasts that they are a leecher (request)

        //Start with another client acting as requester
        // 1. Get random first piece
        // 2. Start looping with other clients in graph using rarest segment
    }

}