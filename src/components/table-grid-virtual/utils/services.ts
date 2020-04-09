import {data} from './MOCK_DATA';

export function getDummyData() {
  // return fetch('https://jsonplaceholder.typicode.com/comments')
  // return fetch('https://jsonplaceholder.typicode.com/photos')
    // .then(response => response.json())
    return Promise.resolve(data);
}
