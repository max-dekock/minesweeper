<script>
	import Minesweeper from './Minesweeper.svelte'
</script>

<main>
	<Minesweeper rows={9} cols={9} numMines={10} />
</main>

<footer>
	<a href="">Source</a>
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