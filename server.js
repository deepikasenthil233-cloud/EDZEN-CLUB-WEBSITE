import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build output directory ('dist')
app.use(express.static(path.join(__dirname, 'dist')));

// Client-side SPA routing fallback: send index.html for any unhandled route in Express 5+
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 EDGEZEN Platform production server running on port ${PORT}`);
});
