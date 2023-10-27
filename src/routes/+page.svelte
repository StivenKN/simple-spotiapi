<script lang="ts">
	import Icon from '@iconify/svelte'
	import { RequestAPI } from '../requests'
	import { onMount } from 'svelte'
	import { msToMinutes } from '$lib/utils'
	import SpotifyIcon from '$lib/spotifyIcon.svelte'

	let songName: string = ''
	let songItems: object[] | 'loading' | ArrayLike<any> | Iterable<any>
	let token: string | null

	const fetchRequest = new RequestAPI()

	onMount(async () => {
		try {
			const response = await fetchRequest.getAccessToken()
			const { token_type, access_token } = response
			sessionStorage.setItem('token', `${token_type} ${access_token}`)
		} catch (error) {
			console.error(error)
		}
	})

	const handleSubmit = async () => {
		try {
			songItems = 'loading'
			token = sessionStorage.getItem('token')
			const response = await fetchRequest.getTrack({
				token,
				query: songName,
				type: 'track'
			})
			songItems = response.tracks.items
		} catch (error) {
			console.error(error)
		}
	}

	const getInfoTrack = async (link: string) => {
		try {
			const response = await fetchRequest.getTrackById({ token, id: link })
			return response
		} catch (error) {
			console.error(error)
			return error
		}
	}
</script>

<main class="w-5/6 mx-auto mt-5 grid grid-rows-[auto_1fr] gap-10">
	<header>
		<h1 class="text-2xl text-center">Bievenido a SpotiApi. ¿Qué deseas escuchar hoy?</h1>
	</header>
	<section class="grid auto-rows-auto gap-10">
		<div class="card p-4">
			<form on:submit|preventDefault={handleSubmit}>
				<label class="label">
					<span>Escribe el nombre de la canción</span>
					<section class="flex gap-1">
						<input class="input" bind:value={songName} name="songName" type="text" placeholder="Blinding lights" required />
						<button type="submit" class="btn-icon variant-filled-secondary"><Icon icon="iconamoon:send-fill" /></button>
					</section>
				</label>
			</form>
		</div>
		<section>
			<div class="card">
				<header class="card-header">
					{Array.isArray(songItems) ? songItems.length : ''} Resultados
				</header>
				<section class="p-4 max-h-fit">
					{#if Array.isArray(songItems) === true}
						<div class="flex flex-col gap-3">
							{#each songItems as item}
								{#await getInfoTrack(item.id)}
									<div class="card min-h-[100px]">
										<div class="placeholder animate-pulse rounded h-[100px]" />
									</div>
								{:then value}
									<div class="card min-h-[100px] max-h-fit grid grid-rows-[auto_1fr] sm:grid-cols-[auto_1fr]">
										<aside class="w-full sm:w-40 min-h-full">
											<img class="rounded object-cover" loading="lazy" src={value.album.images[0].url} alt="Album cover" />
										</aside>
										<section class="min-h-full max-h-fit">
											<header class="card-header">{item.name} - {item.artists[0].name}</header>
											<section class="p-4 grid grid-cols-[1fr_auto] h-2/3 max-h-fit">
												<section class="grid auto-rows-auto gap-1">
													<span><span class="font-bold">Duración:</span> {msToMinutes(value.duration_ms)}</span>
													<span><span class="font-bold">Álbum:</span> <a href={value.album.external_urls.spotify}>{value.album.name}</a></span>
													{#if value.explicit === true}
														<span class="text-yellow-500">Es explícito</span>
													{:else}
														<span class="text-green-500">No es explícito</span>
													{/if}
													<!-- <AudioReproductor audio="https://open.spotify.com/intl-es/track/0kPmcPPkjoyfLhUwHLWrk0" /> -->
												</section>
												<section class="self-end max-w-full">
													<SpotifyIcon urlSong={value.external_urls.spotify} />
												</section>
											</section>
										</section>
									</div>
								{:catch error}
									<div class="card min-h-[100px]">
										<section class="p-4">
											<span class="text-red-500">{error.message ?? 'Error'}</span>
										</section>
									</div>
								{/await}
							{/each}
						</div>
					{:else if songItems === 'loading'}
						<div class="flex flex-col gap-3">
							<div class="placeholder animate-pulse h-[100px] rounded" />
							<div class="placeholder animate-pulse h-[100px] rounded" />
							<div class="placeholder animate-pulse h-[100px] rounded" />
						</div>
					{:else}
						<div>
							<span class="">Sin contenido</span>
						</div>
					{/if}
				</section>
			</div>
		</section>
	</section>
</main>

<style lang="postcss">
</style>
