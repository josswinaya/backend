import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel';
import { sendSuccess, sendError } from '../utils/response';
import { CreateTodoInput, UpdateTodoInput, TodoItem } from '../types/todo.types';

// Helper pemetaan nama kolom database ke field API
const mapTodoToResponse = (row: any): TodoItem => ({
    id: row.id,
    task: row.task,
    is_completed: Boolean(row.is_completed),
    userId: row.user_id,
});

// GET /api/todos - Ambil list todo milik user dengan pagination
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id || res.locals.userId;
    const { page, limit } = req.query;

    try {
        if (page !== undefined || limit !== undefined) {
            const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
            const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
            const offset = (pageNum - 1) * limitNum;

            const [todos, total] = await Promise.all([
                TodoModel.getByUserId(userId, limitNum, offset),
                TodoModel.countByUserId(userId),
            ]);

            const mappedTodos = todos.map(mapTodoToResponse);
            const totalPages = Math.ceil(total / limitNum);

            sendSuccess(res, 200, 'Berhasil mengambil data.', mappedTodos, {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
            });
            return;
        }

        const todos = await TodoModel.getByUserId(userId);
        const mappedTodos = todos.map(mapTodoToResponse);
        sendSuccess(res, 200, 'Berhasil mengambil data.', mappedTodos);
    } catch (error) {
        sendError(res, 500, 'Gagal mengambil data.');
    }
};

// GET /api/todos/:id - Ambil satu todo berdasarkan ID
export const getTodoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id || res.locals.userId;
    try {
        const todo = await TodoModel.getById(Number(id), userId);

        if (!todo) {
            sendError(res, 404, 'Tugas tidak ditemukan!');
            return;
        }

        sendSuccess(res, 200, 'Berhasil mengambil tugas.', mapTodoToResponse(todo));
    } catch (error) {
        sendError(res, 500, 'Gagal mengambil data.');
    }
};

// POST /api/todos - Tambah todo baru
export const createTodo = async (req: Request<{}, {}, CreateTodoInput>, res: Response): Promise<void> => {
    const { task } = req.body;
    const userId = req.user?.id || res.locals.userId;
    try {
        const newId = await TodoModel.create(userId, task);
        sendSuccess(
            res,
            201,
            'Tugas berhasil ditambahkan!',
            { id: newId, task, is_completed: false, userId }
        );
    } catch (error) {
        sendError(res, 500, 'Gagal menambahkan tugas.');
    }
};

// PUT /api/todos/:id - Update task (ubah task atau tandai selesai)
export const updateTodo = async (req: Request<{ id: string }, {}, UpdateTodoInput>, res: Response): Promise<void> => {
    const { id } = req.params;
    const { task, is_completed } = req.body;
    const userId = req.user?.id || res.locals.userId;
    try {
        const affectedRows = await TodoModel.update(Number(id), task, is_completed, userId);

        if (affectedRows === 0) {
            sendError(res, 404, 'Tugas tidak ditemukan!');
            return;
        }

        sendSuccess(res, 200, 'Tugas berhasil diperbarui!');
    } catch (error) {
        sendError(res, 500, 'Gagal memperbarui tugas.');
    }
};

// DELETE /api/todos/:id - Hapus todo
export const deleteTodo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.id || res.locals.userId;
    try {
        const affectedRows = await TodoModel.delete(Number(id), userId);

        if (affectedRows === 0) {
            sendError(res, 404, 'Tugas tidak ditemukan!');
            return;
        }

        sendSuccess(res, 200, 'Tugas berhasil dihapus!');
    } catch (error) {
        sendError(res, 500, 'Gagal menghapus tugas.');
    }
};
