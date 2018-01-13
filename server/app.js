const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost/movies';
const { encrypt, decrypt } = require('./lib')

app.use(bodyParser())
app.set('view engine', 'hbs')

app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }))

app.get('/movies', async (req, res) => {
	const client = new Client({ connectionString })
	await client.connect()
	const data = await client.query('SELECT * FROM Movies;').then(({rows}) => rows)
	const movies = data.map(({title, director, year}) => {
		return {
			title: decrypt(title),
			director: decrypt(director),
			year
		}
	})

	const currentYear = new Date().getFullYear();
	res.render('movies', { title: 'Movies', message: 'Movies', currentYear, movies })
})

app.post('/movies/create', async (req, res) => {
	const {title, director, year} = req.body;

	const client = new Client({ connectionString })
	await client.connect()
	const result = await client.query(
		`INSERT INTO Movies (Title, Director, Year)
		VALUES ('${encrypt(title)}', '${encrypt(director)}', ${year});`
	)

	res.redirect('/movies')
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Example app listening on port 3000!'))
