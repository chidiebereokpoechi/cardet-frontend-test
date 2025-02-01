export const ping = async (timeout = 5000): Promise<number> => {
    const controller = new AbortController()
    const start = performance.now() // More precise timing

    try {
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/ping`, {
            method: 'HEAD', // Better for ping
            cache: 'no-cache',
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) throw new Error('Invalid response')
        return Math.round(performance.now() - start)
    } catch (error) {
        return Infinity // Better than magic number 9999
    }
}
