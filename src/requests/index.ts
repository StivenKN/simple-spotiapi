import axios from 'axios'
import { Buffer } from 'buffer'
import type { ITrack, ITracks } from '../types/types'

export class RequestAPI {
	private readonly clientID = import.meta.env.VITE_CLIENT_ID
	private readonly clientSecret = import.meta.env.VITE_SECRET_ID
	protected readonly redirect_uri = 'http://localhost:5173'
	private baseURL = 'https://api.spotify.com/v1'

	private authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {
			Authorization: `Basic ${Buffer.from(`${this.clientID}:${this.clientSecret}`).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		method: 'POST',
		data: {
			grant_type: 'client_credentials'
		}
	}

	constructor() {}

	public async getAccessToken() {
		const response = await axios(this.authOptions)
		const token = response.data
		return token
	}

	public async getTrack({ token, query, type }: ITracks) {
		const URL = `${this.baseURL}/search?q=${query}&type=${type}`
		const response = await axios.get(URL, {
			headers: {
				Authorization: token
			}
		})
		return response.data
	}

	public async getTrackById({ token, id }: ITrack) {
		const URL = `${this.baseURL}/tracks/${id}`
		const response = await axios.get(URL, {
			headers: {
				Authorization: token
			}
		})
		return response.data
	}
}
