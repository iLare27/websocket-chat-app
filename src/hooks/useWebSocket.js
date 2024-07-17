import { useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket(url);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);
            onMessage(data);
        };

        ws.current.onclose = (event) => {
            if (event.wasClean) {
                console.log(`WebSocket connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.error('WebSocket connection closed unexpectedly');
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error.message);
        };

        return () => {
            console.log('Cleaning up WebSocket connection');
            ws.current.close();
        };
    }, [url, onMessage]);

    return ws.current;
};

export default useWebSocket;
