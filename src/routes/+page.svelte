<script lang="ts">
	import Icon from '@iconify/svelte'
	import { RequestAPI } from '../requests'
	import { onMount } from 'svelte'
	import { msToMinutes } from '$lib/utils'
	import AudioReproductor from '@components/audioReproductor.svelte'

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
			console.log(response)
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
												<section>
													<span>Duración: {msToMinutes(value.duration_ms)}</span>
													<AudioReproductor audio="https://open.spotify.com/track/0kPmcPPkjoyfLhUwHLWrk0" />
												</section>
												<section class="self-end border max-w-full">
													<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" class="object-contain" viewBox="0 0 256 256"
														><path
															fill="#1ED760"
															d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128c70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644c-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007a7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276c3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289c-34.406-21.148-86.853-27.273-127.548-14.92c-5.278 1.594-10.852-1.38-12.454-6.649c-1.59-5.278 1.386-10.842 6.655-12.446c46.485-14.106 104.275-7.273 143.787 17.007c4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978c-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405c-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z"
														/></svg
													>
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
