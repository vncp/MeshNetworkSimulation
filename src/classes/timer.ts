import React, { Component } from "react";

export default class Timer {
    _subscribers: any[];
    _loopId: number;

    constructor() {
        this._subscribers = [];
        this._loopId = null;
    }
    
    loop = (time: number) => {
        if (this._loopId)
            this._subscribers.forEach((callback: any) => {
                callback(time);
            })
        this._loopId = requestAnimationFrame(this.loop);
    }
    
    start() {
        if(!this._loopId) {
            this.loop;
        }
    }
    
    stop() {
        if (this._loopId) {
            cancelAnimationFrame(this._loopId);
            this._loopId = null
        }
    }
    
    subscribe(callback: any) {
        if (this._subscribers.indexOf(callback) === -1)
            this._subscribers.push(callback);
    }
    
    unsubscribe(callback: any) {
        this._subscribers = this._subscribers.filter((s: any) => s !== callback);
    }
    
    
}