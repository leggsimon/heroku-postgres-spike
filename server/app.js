const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost/movies';

app.use(bodyParser())
app.set('view engine', 'hbs')

// const movies = [];

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }))

app.get('/movies', async (req, res) => {
	const client = new Client({ connectionString })
	await client.connect()
	const {rows: movies} = await client.query('SELECT * FROM Movies;')
	console.log('\x1b[32m', movies, '\x1b[0m')

	const currentYear = new Date().getFullYear();
	res.render('movies', { title: 'Movies', message: 'Movies', currentYear, movies })
})

app.post('/movies/create', async (req, res) => {
	const {title, director, year} = req.body;

	const client = new Client({ connectionString })
	await client.connect()
	const result = await client.query(
		`INSERT INTO Movies (Title, Director, Year)
		VALUES ('${title}', '${director}', ${year});`
	)
	console.log('\x1b[36m', result, '\x1b[0m')

	res.redirect('/movies')
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Example app listening on port 3000!'))
