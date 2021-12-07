import { time } from "console";
import { timingSafeEqual } from "crypto";
import React, { Component } from "react";
import Timer from "./timer";

interface IProps {
    running: any;
    onUpdate: any;
}

/* 
*   A class to create a simulation loop in React, keeping track of time.
*/

export default class Loop extends Component<IProps> {
    _timer: Timer;
    _previousTime: number;
    _previousDelta: number;

    constructor(props:any) {
        super(props);
        this._timer = new Timer();
        this._timer.subscribe(this.updateHandler);
        this._previousTime = null;
        this._previousDelta = null;

    }
    
    componentDidMount() {
        if (this.props.running)
        this.start();
    }
    
    componentWillUnmount() {
        this.stop();
        this._timer.unsubscribe(this.updateHandler);
    }
    
    UNSAFE_componentWillReceiveProps(nextProps: any): void {
        if (nextProps.running !== this.props.running) {
            if(nextProps.running) this.start();
            else this.stop();
        }
    }
    
    start = () => {
        this._previousTime = null;
        this._previousDelta = null;
        this._timer.start();
    }
    
    stop = () => {
        this._timer.stop();
    }
    
    updateHandler = (currentTime: number) => {
        let args = {
            window: window,
            time: {
                current: currentTime,
                previous: this._previousTime,
                delta: currentTime - (this._previousTime || currentTime),
                previousDelta: this._previousDelta
            }
        };
        
        if (this.props.onUpdate) this.props.onUpdate(args);
        
        this._previousTime = currentTime;
        this._previousDelta = args.time.delta;
    }
}