import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from 'react-native-elements';
// const VERSION = 'v1';
//TODO: for now change the base url as wifi port
const BASE_URL = 'http://197.156.76.70:8080';

function postMethod(api, data) {

  var url = `${BASE_URL}/${api}`;
  var postData = JSON.stringify({
    Record: data
  })
  var url = `${BASE_URL}/${api}`;
  return new Promise(async (resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        Record: data
      }),
    })
    .then(response => {
          let passResponse = true;
          if (passResponse) {
            resolve(response);

          }
  
        })
        .catch(error => {       
          if (error) {
            reject(error);
            return error
          }
        });
  });
}
export {postMethod};

function getMethod(api, isVersion = true) {
  if(isVersion) { 
    var url = `${BASE_URL}/${api}`;
  } else {
    url = `${BASE_URL}/${api}`;
  }

  return new Promise(async (resolve, reject) => {
    axios.get(
      url
    )
      .then(response => {
        let passResponse = true;``
        if (passResponse) {
          resolve(response);
        }
      })
      .catch(error => {
        if (error) {
          reject(error);
          return error
        }
      });
  });
}
export {getMethod};
function patchMethod(api, data={}) {
  const url = `${BASE_URL}/${api}`;
  return new Promise(async (resolve, reject) => {
    axios.patch(
      url, 
      data,
    )
      .then(response => {
        let passResponse = true;
        if (passResponse) {
          resolve(response);
        }
      })
      .catch(error => {
        if (error) {
          reject(error);
          return error
        }
      });
  });
}
export {patchMethod};
function putMethod(api, data = {}) {
  const url = `${BASE_URL}/${api}`;
  return new Promise(async (resolve, reject) => {
    axios.put(
      url, 
      data
    )
      .then(response => {
        let passResponse = true;
        if (passResponse) {
          resolve(response);
        }

      })
      .catch(error => {
        if (error) {
          reject(error);
          return error
        }
      });
  });
}
export {putMethod};