const development_domain = 'http://localhost:3000';
const production_domain = 'http://vdg.runasp.net';


const SERVER_URL = process.env.NODE_ENV === 'development' ? development_domain : production_domain;
const API_URL: string = `${SERVER_URL}/api/`;

export { SERVER_URL, API_URL };