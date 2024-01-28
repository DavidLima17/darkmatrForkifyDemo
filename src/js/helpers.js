import { TIMEOUT_SEC } from './config.js';

/**
 * Creates a promise that rejects with an error if the request takes too long.
 * @param {number} s - The timeout duration in seconds.
 * @returns {Promise} - A promise that rejects with an error if the request takes too long.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Performs an AJAX request to the specified URL.
 * @param {string} url - The URL to send the request to.
 * @param {Object} [uploadData] - The data to be uploaded with the request (optional).
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 * @throws {Error} - If the request fails or returns an error status.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes JSON data from the specified URL.
 * @param {string} url - The URL to send the DELETE request to.
 * @returns {Promise<number>} - A promise that resolves to -1 if the request is successful.
 * @throws {Error} - If there is an error during the request.
 */
export const deleteJSON = async function (url) {
  try {
    const fetchPro = fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return -1;
  } catch (error) {
    throw error;
  }
};
