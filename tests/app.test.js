import request from 'supertest';
import app from '../src/app.js';

describe('API', () => {
  it('health ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('ne révèle pas la technologie utilisée', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('create todo', async () => {
    const created = await request(app).post('/todos').send({ title: 'Read' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ id: expect.any(Number), title: 'Read' });
  });

  it.each([
    ['sans titre', {}],
    ['titre vide', { title: '' }],
    ["titre composé d'espaces", { title: '   ' }],
    ["titre qui n'est pas une chaîne", { title: 123 }],
  ])('refuse un POST invalide : %s', async (_label, body) => {
    const res = await request(app).post('/todos').send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('title required');
  });

  it('liste les todos créés', async () => {
    const { body: todo } = await request(app).post('/todos').send({ title: 'List me' });
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual(todo);
  });

  it('supprime un todo existant', async () => {
    const { body: todo } = await request(app).post('/todos').send({ title: 'Delete me' });
    const res = await request(app).delete(`/todos/${todo.id}`);
    expect(res.status).toBe(204);
    const { body: todos } = await request(app).get('/todos');
    expect(todos).not.toContainEqual(todo);
  });

  it.each([
    ['id inexistant', '999999'],
    ['id non numérique', 'abc'],
  ])('renvoie 404 au DELETE : %s', async (_label, id) => {
    const res = await request(app).delete(`/todos/${id}`);
    expect(res.status).toBe(404);
  });
});
