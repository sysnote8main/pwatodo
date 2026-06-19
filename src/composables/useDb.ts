import { openDB, type IDBPDatabase } from "idb";
import type { Todo } from "../types/todo";

const DB_NAME = "pwatodo";
const DB_VERSION = 1;
const STORE_NAME = "todos";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, {
						keyPath: "id",
					});
					store.createIndex("createdAt", "createdAt");
				}
			},
		});
	}
	return dbPromise;
}

export async function getAllTodos(): Promise<Todo[]> {
	const db = await getDb();
	const todos = await db.getAll(STORE_NAME);
	return todos.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addTodo(title: string): Promise<Todo> {
	const db = await getDb();
	const now = Date.now();
	const todo: Todo = {
		id: crypto.randomUUID(),
		title,
		completed: false,
		createdAt: now,
		updatedAt: now,
	};
	await db.add(STORE_NAME, todo);
	return todo;
}

export async function updateTodo(
	id: string,
	updates: Partial<Pick<Todo, "title" | "completed">>,
): Promise<void> {
	const db = await getDb();
	const todo = await db.get(STORE_NAME, id);
	if (!todo) throw new Error("Todo not found");
	const updated = { ...todo, ...updates, updatedAt: Date.now() };
	await db.put(STORE_NAME, updated);
}

export async function deleteTodo(id: string): Promise<void> {
	const db = await getDb();
	await db.delete(STORE_NAME, id);
}

export async function clearCompleted(): Promise<void> {
	const db = await getDb();
	const todos = await db.getAll(STORE_NAME);
	const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
	const tx = db.transaction(STORE_NAME, "readwrite");
	await Promise.all(completedIds.map((id) => tx.store.delete(id)));
	await tx.done;
}
