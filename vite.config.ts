import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

function markdownPlugin() {
    return {
        name: 'markdown',
        transform(code: string, id: string) {
            if (id.endsWith('.md')) {
                return `export default ${JSON.stringify(code)};`;
            }
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [react(), markdownPlugin()],
    build: {
        sourcemap: true,
    },
});
