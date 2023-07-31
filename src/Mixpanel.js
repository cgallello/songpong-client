import mixpanel from 'mixpanel-browser';

var productionHost = 'playlistgen.com'; 
var devToken = '48bbe546e75208ca08d25f8fb7b469d6'; 
var prodToken = '85cd79bafd3553eb0658f852997f374c'; 
 
//If the hostname is anything other than your production domain, initialize the Mixpanel library with your Development Token 
let token = devToken;
let debug = true;
if (window.location.hostname.toLowerCase().search(productionHost) > 0) { 
  token = prodToken;
  debug = false;
}
mixpanel.init(token, { debug: debug, track_pageview: true, persistence: 'localStorage' });

// let env_check = process.env.NODE_ENV === 'production';

// let actions = {
//   identify: (id) => {
//     if (env_check) mixpanel.identify(id);
//   },
//   alias: (id) => {
//     if (env_check) mixpanel.alias(id);
//   },
//   track: (name, props) => {
//     if (env_check) mixpanel.track(name, props);
//   },
//   people: {
//     set: (props) => {
//       if (env_check) mixpanel.people.set(props);
//     },
//   },
// };

// export let Mixpanel = actions;