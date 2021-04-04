/**
 * Function that calls an async function passed in multiple times with a given interval.
 * Mostly used to fetch messages on loop
 */

const fresh = (interval, func, callback) => {
    const id = setInterval(() => {
        const fetchBackend = async () => {
            try {
                const res = await func()
                callback(res)
            }
            catch(err) {
                clearInterval(id)
            }
        }
        fetchBackend()
    }, interval)

    const stop = () => {
        clearInterval(id)
    }

    return stop   
}

export default fresh