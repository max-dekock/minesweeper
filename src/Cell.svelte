<script>
    import * as ms from './minesweeper.js'

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let v;

    function parseValue(value) {
        switch(String(value)) {
            case ms.BLANK:
                return '.';
            case '0':
                return '';
            case ms.FLAG:
                return '🚩';
            case ms.MINE:
                return '💣';
            default:
                return String(value);
        }
    }

    $: content = parseValue(v);

    function handleMouseup(event) {
        if (event.button === 0) {
            if (event.detail === 1 && v === ms.BLANK) {
                dispatch('sweep');
            } else if (event.detail === 2 && !isNaN(v)) {
                dispatch('sweepadj');
            }
        } else if (event.button === 2) {
            if (v === ms.BLANK || v === ms.FLAG) {
                dispatch('toggleflag');
            }
        }
    }
</script>

<div 
    class="cell"
    on:mouseup={handleMouseup}
    on:contextmenu|preventDefault
>
    {content}
</div>

<style>
    .cell {
        width: 100%;
        height: 100%;
        font-weight: bold;
    }
</style>