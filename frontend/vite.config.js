import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/auth': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/books': {
                target: 'http://localhost:3002',
                changeOrigin: true,
            },
            '/loans': {
                target: 'http://localhost:3002',
                changeOrigin: true,
            },
            '/returns': {
                target: 'http://localhost:3002',
                changeOrigin: true,
            },
            '/statistics': {
                target: 'http://localhost:3003',
                changeOrigin: true,
            },
            '/recommendations': {
                target: 'http://localhost:3003',
                changeOrigin: true,
            },
            '/summary': {
                target: 'http://localhost:3003',
                changeOrigin: true,
            },
        },
    },
});