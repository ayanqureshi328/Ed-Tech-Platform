import express from 'express';
import { MongoClient } from 'mongodb';
import { resolve } from 'node:path';

const app = express();
const port = Number(process.env.PORT) || 3001;
const mongoUri = process.env.MONGODB_URI;
const client = mongoUri ? new MongoClient(mongoUri) : null;

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', databaseConfigured: Boolean(mongoUri) });
});

app.post('/api/enrollments', async (request, response) => {
  const { name, email, course } = request.body ?? {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    return response.status(400).json({ error: 'Please enter your full name.' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return response.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (typeof course !== 'string' || !course.trim() || course.length > 120) {
    return response.status(400).json({ error: 'Please choose a course.' });
  }
  if (!client) {
    return response.status(503).json({ error: 'Enrollment is not available yet. Please try again later.' });
  }

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB || 'novalearn');
    const result = await database.collection('enrollments').insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      createdAt: new Date(),
    });
    return response.status(201).json({ id: result.insertedId.toString() });
  } catch (error) {
    console.error('Enrollment save failed:', error.message);
    return response.status(500).json({ error: 'We could not save your enrollment. Please try again.' });
  }
});

app.use(express.static(resolve('dist')));
app.use((request, response, next) => {
  if (request.method !== 'GET' || request.path.startsWith('/api/')) return next();
  response.sendFile(resolve('dist/index.html'), (error) => {
    if (error) next();
  });
});

app.listen(port, () => {
  console.log(`NovaLearn API listening on http://localhost:${port}`);
});