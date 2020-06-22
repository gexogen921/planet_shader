
export default class perlin {
    constructor(sizeX = 0, sizeY = 0, sizeC = 0) {
        this._cellSize = sizeC;
        this._x = sizeY;
        this._y = sizeY;

        let lx = Math.trunc(sizeX / sizeC) + 2;
        let ly = Math.trunc(sizeY / sizeC) + 2;

        this.lattice = [];
        for (let j = 0; j < ly; j++) {
            this.lattice[j] = [];

            for (let i = 0; i < lx; i++) {
                this.lattice[j][i] = {x: 0, y: 0};
                this.lattice[j][i].x = ((Math.random() * 2) - 1) * this._cellSize;
                this.lattice[j][i].y = ((Math.random() * 2) - 1) * this._cellSize;
            }
        }
    }

    getHeight(x = 0, y = 0) {
        let s = 0;
        let t = 0;
        let u = 0;
        let v = 0;

        let gridPointX0 = Math.trunc(x / this._cellSize);
        let gridPointY0 = Math.trunc(y / this._cellSize);
        let gridPointX1 = gridPointX0 + 1;
        let gridPointY1 = gridPointY0 + 1;

        s = this._getDotProduct(x, y, gridPointX0, gridPointY0);
        t = this._getDotProduct(x, y, gridPointX1, gridPointY0);
        u = this._interp(s, t, x - gridPointX0 * this._cellSize);

        s = this._getDotProduct(x, y, gridPointX0, gridPointY1);
        t = this._getDotProduct(x, y, gridPointX1, gridPointY1);
        v = this._interp(s, t, x - gridPointX0 * this._cellSize);

        return (this._interp(u, v, y - gridPointY0 * this._cellSize));
    }

    _getDotProduct(x = 0, y = 0, ix = 0, iy = 0) {
        let dx = x - (ix * this._cellSize);
        let dy = y - (iy * this._cellSize);

        return (dx * this.lattice[iy][ix].x) + (dy * this.lattice[iy][ix].y);
    }

    _interp(s = 0, t = 0, w = 0) {
        w = w / this._cellSize;
        s = s / this._cellSize;
        t = t / this._cellSize;

        return s + ((3 * (w * w) - 2 * (w * w * w)) * (t - s));
    }
}
