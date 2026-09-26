import { test, expect } from '@playwright/test';

test.describe('Todos', () => {
	test('GET /todos/1 returns a valid todo object', async ({ request }) => {
		const response = await request.get('/todos/1');

		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(body).toMatchObject({
			id: 1,
			userId: expect.any(Number),
			title: expect.any(String),
			completed: expect.any(Boolean),
		});
	});

	test('GET /todos returns a list of 200 items', async ({ request }) => {
		const response = await request.get('/todos');
		expect(response.ok()).toBeTruthy();

		const todos = await response.json();
		expect(Array.isArray(todos)).toBeTruthy();
		expect(todos).toHaveLength(200);
	});

    test('POST /todos creates fake todo', async ({ request }) => {
    const response = await request.post('/todos', {
      data: {
        title: 'New Todo',
        completed: false,
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject({
      id: expect.any(Number), // JSONPlaceholder always returns id: 201
      title: 'New Todo',
      completed: false,
      userId: 1,
    });
  });

  test('PUT /todos/1 updates todo (fake)', async ({ request }) => {
    const response = await request.put('/todos/1', {
      data: {
        id: 1,
        title: 'Updated Todo',
        completed: true,
        userId: 1,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      title: 'Updated Todo',
      completed: true,
      userId: 1,
    });
  });

   test('PATCH /todos/1 updates todo partially (fake)', async ({ request }) => {
    const response = await request.patch('/todos/1', {
      data: {
        completed: true,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.completed).toBe(true);
  });

  test('DELETE /todos/1 returns empty response (fake)', async ({ request }) => {
    const response = await request.delete('/todos/1');
    expect(response.status()).toBe(200);
  });
});

test.describe('Users', () => {
	test('GET /users/8 returns a valid user object', async ({ request }) => {
		const response = await request.get('/users/8');

		expect(response.status()).toBe(200);

		const body = await response.json();

  expect(body).toMatchObject({
    id: 8,
    name: expect.any(String),
    username: expect.any(String),
    email: expect.any(String),

    address: {
      street: expect.any(String),
      suite: expect.any(String),
      city: expect.any(String),
      zipcode: expect.any(String),
      geo: {
        lat: expect.any(String),
        lng: expect.any(String),
      },
    },

    phone: expect.any(String),
    website: expect.any(String),

    company: {
      name: expect.any(String),
      catchPhrase: expect.any(String),
      bs: expect.any(String),
    },
  });
});

	test('GET /users returns a list of 10 items', async ({ request }) => {
		const response = await request.get('/users');
		expect(response.ok()).toBeTruthy();

		const users = await response.json();
		expect(Array.isArray(users)).toBeTruthy();
		expect(users).toHaveLength(10);
	});
});
