export const clientId = '5c8154ab9924430885964fe69bd30832';
let env_check = process.env.NODE_ENV === 'production';
let redirect = null;
if(env_check) {
    redirect = 'https://www.playlistgen.com/auth';
} else {
    redirect = 'http://localhost:3000/auth';
}
export const redirectUri = redirect;