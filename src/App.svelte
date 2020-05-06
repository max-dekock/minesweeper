<script>
	import Minesweeper from './Minesweeper.svelte'

	let rows = 9;
	let cols = 9
	let numMines = 10;

	function resize(r, c, m) {
		rows = r;
		cols = c;
		numMines = m;
	}
</script>

<main>
	<Minesweeper bind:rows={rows} bind:cols={cols} bind:numMines={numMines} />

	<button on:click={() => resize(9, 9, 10)}>Beginner</button>
	<button on:click={() => resize(16, 16, 40)}>Intermediate</button>
	<button on:click={() => resize(16, 30, 99)}>Expert</button>

</main>

<footer>
	<a href="https://github.com/willowdekock/minesweeper">Source</a>
</footer>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: none;
		margin: 0 auto;
	}

	footer {
		text-align: center;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>