export default class File{
    readonly _maxsize: number;
    _segments: boolean[] = [];

    constructor(size: number, complete = false){
        this._maxsize = size;
        this._segments.length = size;
        this._segments.fill(false, 0, size);
        if (complete === true) {
            this._segments.fill(true, 0, size);
        }
    }
    
    isComplete = (): boolean => {
        for (let i = 0; i < this._maxsize; i++) {
            if (this._segments[i] === false)
                return false;
        }
        return true;
    }
} 