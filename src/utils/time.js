/*
 *  Utility functions for timing
 */

/** Awaitable promise to sleep for X ms
 * 
 * @param {number} timeout Timeout in miliseconds
 * @returns 
 */
export function sleep(timeout) {
    return new Promise(res => {
        setTimeout(res, timeout)
    });
}

// Retry a function X times, with an interval inbetwixt
export async function retry(callback, interval, count) {
    let i = 0;
    while(true) {
        try {
            let result = await callback();
            return result;
        } catch (e) {
            // Ignore first few failures
            if (i < count) {
                i++;
                console.error(e);
                await sleep(interval);
            } else {
                throw e;
            }
        }
    }
}