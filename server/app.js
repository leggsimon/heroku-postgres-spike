const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser())
app.set('view engine', 'hbs')

const movies = [];

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => res.render('index', { title: 'Hey', message: 'Hello there!' }))

app.get('/movies', (req, res) => {
	const currentYear = new Date().getFullYear();
	res.render('movies', { title: 'Movies', message: 'Movies', currentYear, movies })
})

app.post('/movies/create', (req, res) => {
	movies.push(req.body)
	res.redirect('/movies')
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Example app listening on port 3000!'))
