import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { requestIdMiddleware } from './middlewares/loggerMiddleware';
import { sendSuccess, sendError } from './utils/response';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware logger dan requestId (X-Request-Id)
app.use(requestIdMiddleware);

// Route utama - cek apakah server berjalan
app.get('/', (req: Request, res: Response) => {
  sendSuccess(res, 200, 'Backend Todo Praktikum Berjalan Mulus!');
});

// Daftarkan semua route dengan prefix /api
app.use('/api', routes);

// 404 Handler - dipanggil jika tidak ada route yang cocok
app.use((req: Request, res: Response) => {
  sendError(res, 404, `Route ${req.method} ${req.url} tidak ditemukan!`);
});

// Global Error Handler - menangkap error yang tidak tertangani
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Terjadi error:', err.message);
  sendError(res, 500, 'Terjadi kesalahan pada server.');
});

export default app;
