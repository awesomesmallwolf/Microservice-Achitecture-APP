import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // this block runs on the server
    // http://SERVICENAME.NAMESPACE.svc.cluster.local

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // this block runs on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
