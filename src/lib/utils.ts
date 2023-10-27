export const msToMinutes = (msData: number) => {
	const minutos = msData / (60 * 1000)
	const segundos = (msData % (60 * 1000)) / 1000

	return `${String(minutos.toFixed(0).padStart(2, '0'))}:${String(segundos.toFixed(2)).slice(0, -3).padEnd(2, '0')}`
}
