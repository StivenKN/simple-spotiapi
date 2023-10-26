<script lang="ts">
	import Icon from '@iconify/svelte';
	import { RequestAPI } from '../requests';
	let showSong = false;
	let songName = '';
	const handleSubmit = () => {
		console.log(songName);
		const fetchData = new RequestAPI('url');
		fetchData.getID();
	};
</script>

<main class="w-5/6 mx-auto mt-5 grid grid-rows-[auto_1fr_1fr] gap-10">
	<header>
		<h1 class="text-2xl text-center">Bievenido a SpotiApi. ¿Qué deseas escuchar hoy?</h1>
	</header>
	<section class="">
		<div class="card p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Escribe el nombre de la canción</span>
					<section class="flex gap-1">
						<input
							class="input"
							bind:value={songName}
							name="songName"
							type="text"
							placeholder="Blinding lights"
						/>
						<button type="submit" class="btn-icon variant-filled-secondary"
							><Icon icon="iconamoon:send-fill" /></button
						>
					</section>
				</label>
			</form>
		</div>
	</section>
	<section>
		<div class="card p-4">
			{#if showSong === true}
				<div class="">
					<span>N/A</span>
				</div>
			{:else}
				<div class="">Sin contenido</div>
			{/if}
		</div>
	</section>
</main>
