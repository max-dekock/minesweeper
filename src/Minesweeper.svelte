<script>
    import Cell from './Cell.svelte'
    import Smiley from './Smiley.svelte'

    import Minefield from './minefield.js'
    import * as ms from './minesweeper.js'

    import { onDestroy } from 'svelte'

    export let rows;
    export let cols;
    export let numMines;

    let mf = new Minefield(rows, cols, numMines);
    let surf = ms.newSurface(mf);
    let firstClick = true;
    let startTime = null;
    let finishTime = null;
    let currentTime = Date.now();

    const interval = setInterval(() => currentTime = Date.now(), 99);
    onDestroy(() => clearInterval(interval));

    function sweep(x, y) {
        if (firstClick) {
            while (mf.isMine(x, y)) {
                reset();
            }
            firstClick = false;
            startTime = Date.now();
        }
        if (!ms.isLost(surf)) {
            surf = ms.sweep(mf, surf, [x, y]);
        }
    }

    function sweepAdj(x, y) {
        if (!ms.isLost(surf)) {
            surf = ms.sweepAdj(mf, surf, [x, y]);
        }
    }

    function toggleFlag(x, y) {
        if (!ms.isLost(surf)) {
            surf = ms.toggleFlag(surf, [x, y]);
        }
    }

    function reset() {
        mf = new Minefield(rows, cols, numMines);
        surf = ms.newSurface(mf);
        firstClick = true;
        startTime = null;
        finishTime = null;
    }

    function prependZeros(num) {
        let string = String(Math.min(Math.floor(num), 999));
        return Array(string.length < 3 ? 4 - string.length : 0).join('0') + string;
    }

    $: if (rows !== mf.rows || cols !== mf.cols || numMines !== mf.numMines) {
        reset();
    }

    $: finished = ms.isLost(surf) || ms.isWon(surf);
    $: status = ms.isLost(surf) ? 'lose' : ms.isWon(surf) ? 'win' : 'default';
    $: if (finished && finishTime === null) {
        finishTime = Date.now();
    }
    $: numMinesRemaining = mf.numMines - surf.flat().filter(v => v === ms.FLAG).length;
    $: elapsedTime = startTime === null 
        ? 0 : finishTime === null
            ? Math.max(0, (currentTime - startTime) / 1000) 
            : (finishTime - startTime) / 1000;
</script>

<div class="minesweeper">
    <div class="status-bar">
        <div class="indicator-num">{prependZeros(numMinesRemaining)}</div>

        <button class="smiley-button" on:click={reset}>
            <Smiley bind:status={status} />
        </button>

        <div class="indicator-num">{prependZeros(elapsedTime)}</div>
    </div>

    <table class="minefield">
        {#each surf as row, x (x)}
        <tr class="minefield-row">
            {#each row as v, y (x * (cols + 1) + y)}
            <td
                class="minefield-cell"
            >
                <Cell
                    bind:v={v}
                    on:sweep={() => sweep(x, y)}
                    on:sweepadj={() => sweepAdj(x, y)}
                    on:toggleflag={() => toggleFlag(x, y)}
                />
            </td>
            {/each}
        </tr>
        {/each}
    </table>
</div>

<style>
    .minesweeper {
        width: max-content;
        margin: 25px auto;
    }
    .minefield {
        cursor: default;
        user-select: none;
        border: 2px solid black;
        border-collapse: collapse;
        margin: auto;
    }
    .minefield-cell {
        border: 1px solid black;
        width: 1.5em;
        height: 1.5em;
    }
    .status-bar {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        padding: 5px;
    }
    .smiley-button {
        margin: 0 45px;
    }
    .indicator-num {
        font-family: "Lucida Console", Monaco, monospace;
        font-size: 64px;
        color: gray;
        height: max-content;
        width: max-content;
        padding: 4px;
        align-self: center;
    }
</style>