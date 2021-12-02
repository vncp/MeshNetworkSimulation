export default class File{
    readonly _maxsize: number;
    _pieces: boolean[] = [];

    constructor(size: number){
        this._maxsize = size;
        this._pieces.length = size;
        this._pieces.fill(false, 0, size);
    }
    
    isComplete = (): boolean => {
        for (let i = 0; i < this._maxsize; i++) {
            if (this._pieces[i] === false)
                return false;
        }
        return true;
    }
} 