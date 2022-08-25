import axios from 'axios';

let istanbulSync = () => {
  axios.post(
    'http://127.0.0.1:11118/istanbulSync',
    {
      coverage: JSON.stringify(window.__coverage__)
    },
    (res) => {
      console.log('res', res);
    }
  );
};
window.onload = () => {
  istanbulSync();
};
document.body.addEventListener('click', istanbulSync);
