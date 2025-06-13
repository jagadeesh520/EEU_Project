import React from 'react'
import { postMethod } from './APIServices'
const postAPICall = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    postMethod(url, data).then((response) => {
      resolve(response)
    }).catch((error) => {
      reject(error);
    }) 
  })
}; export {postAPICall};
  
// const getAPICall = (url= "", isVersion = true) => {
//   return new Promise((resolve, reject) => {
//     getMethod(url, isVersion).then((response) => {
//       resolve(response)
//     }).catch((error) => {
//       reject(error);
//     })  
//   })}; export {getAPICall};

//   const patchAPICall = (url= "") => {
//     return new Promise((resolve, reject) => {
//       patchMethod(url).then((response) => {
//         resolve(response)
//       }).catch((error) => {
//         reject(error);
//       })  
//     })}; export {patchAPICall};
//     const putAPICall = (url= "", data={}) => {
//       return new Promise((resolve, reject) => {
//         putMethod(url, data).then((response) => {
//           resolve(response)
//         }).catch((error) => {
//           reject(error);
//         })  
//       })}; export {putAPICall};
  
