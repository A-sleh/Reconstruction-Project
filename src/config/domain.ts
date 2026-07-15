const development_domain = 'http://aleppo-reconsruction-5th.runasp.net';
const production_domain = 'http://aleppo-reconsruction-5th.runasp.net';

const development_domain_api = `${development_domain}/api/`
const production_domain_api = `${production_domain}/api/`
// const development_domain_api = `http://localhost:3000/`


const SERVER_URL = process.env.NODE_ENV === 'development' ? development_domain_api : production_domain_api;
const API_URL: string = `${SERVER_URL}/`;

export { SERVER_URL, API_URL };