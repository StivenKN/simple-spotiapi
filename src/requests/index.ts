export class RequestAPI {
  private readonly clientID = import.meta.env.VITE_CLIENT_ID
  private readonly clientSecret = import.meta.env.VITE_SECRET_ID
  protected readonly redirect_uri = 'http://localhost:5173'
  private authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(this.clientID + ':' + this.clientSecret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  }
  name: string
  constructor(name: string) {
    this.name = name
  }
  getID() {
    console.log(this.clientID, this.clientSecret)
  }
}