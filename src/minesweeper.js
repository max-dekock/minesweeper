export const FLAG = 'flag';
export const BLANK = 'blank';
export const MINE = 'mine';

export function newSurface(minefield) {
    return minefield.mines.map(col => col.map(v => BLANK));
}

export function copySurf(surface) {
    return surface.map(col => Array.from(col));
}

export function explode(minefield, surface) {
    return surface.map(
        (col,x) => col.map(
            (v,y) => minefield.isMine(x,y) ? MINE : v
    ));
}

export function sweep(minefield, surface, coords) {
    if (minefield.isMine(...coords)) {
        return explode(minefield, surface);
    } else {
        let n = minefield.adjMines(...coords);
        let newSurf = copySurf(surface);
        newSurf[coords[0]][coords[1]] = n;
        if (n == 0) {
            return minefield.adjCoords(...coords)
                .filter(([x,y]) => newSurf[x][y] === BLANK)
                .reduce(
                    (prevSurf, adjCoord) => {
                        return sweep(minefield, prevSurf, adjCoord);
                    },
                    newSurf
            );
        } else {
            return newSurf;
        }
    }
}

export function sweepAdj(minefield, surface, [x, y]) {
    let adjMines = surface[x][y];
    if (isNaN(adjMines)) surface;

    let adjCoords = minefield.adjCoords(x, y);
    let adjFlags = adjCoords
        .map(([x, y]) => surface[x][y])
        .filter(v => v === FLAG).length;
    if (adjMines === adjFlags) {
        let newSurf = copySurf(surface);
        return adjCoords
            .filter(([x, y]) => surface[x][y] === BLANK)
            .reduce((surf, coords) => sweep(minefield, surf, coords), newSurf);
    } else {
        return surface;
    }
}

export function toggleFlag(surface, [x, y]) {
    if (surface[x][y] === BLANK) {
        let newSurf = copySurf(surface);
        newSurf[x][y] = FLAG;
        return newSurf;
    } else if (surface[x][y] === FLAG) {
        let newSurf = copySurf(surface);
        newSurf[x][y] = BLANK;
        return newSurf;
    } else {
        return surface;
    }
}

export function isWon(surface) {
    return surface.flat().every(v => v !== BLANK && v !== MINE);
}

export function isLost(surface) {
    return surface.flat().some(v => v === MINE);
}