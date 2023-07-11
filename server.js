const express = require('express');
const pool = require('./db');
const PORT = 3000;

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
	try {
		const data = await pool.query('SELECT * FROM schools');
		res.status(200).send(data.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.post('/', async (req, res) => {
	const { name, location } = req.body;
	try {
		await pool.query('INSERT INTO schools (name, address) VALUES ($1, $2)', [
			name,
			location,
		]);
		res.status(200).send({ message: 'Successfully added child' });
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.post('/test', (req, res) => {
	console.log(req.body);
	console.log('Hi from beginning of the POST process');
	const { name, location } = req.body;
	if (name != undefined && location != undefined) {
		res.status(200).send({
			message: `YOUR KEYS WERE ${name}, ${location}`,
		});
	} else {
		console.log(`Error`);
	}
});

app.get('/setup', async (req, res) => {
	try {
		await pool.query(
			'CREATE TABLE schools ( id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, address VARCHAR(100) NOT NULL)'
		);
	} catch (error) {
		res.sendStatus(500);
		console.log(`Error: ${error}`);
	}
});

app.listen(PORT, () => {
	console.log(`Server listen on port: ${PORT}`);
});
