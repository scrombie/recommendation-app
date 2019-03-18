const express = require('express');

express.json();
const os = require('os');
const neo = require('./neoAPI');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.get('/api/search', (req, res) => {
  const { s, type } = req.query;
  neo.search(s, type).then(r => res.send({ query: s, results: r }));
});
app.get('/api/symptoms', (req, res) => {
  neo.getSymptoms(req.query.s).then(r => res.send(r.length > 0 ? r : []));
});
app.post('/api/symptoms/search-by-diagnosis', (req, res) => {
  const query = req.body;
  neo.findAssociatedSymptoms(query).then(r => res.send(r.length > 0 ? r : []));
});
app.get('/api/symptoms/:id', (req, res) => {
  neo.getSymptom(req.params.id).then(r => res.send(r));
});
app.post('/api/diagnosis/search-by-symptoms', (req, res) => {
  neo.findPossibleDiagnosisBySymptoms(req.body).then(r => res.send(r.length > 0 ? r : []));
});
app.post('/api/diagnosis/with-symptoms', (req, res) => {
  neo.findDiagnosisWithExactSymptoms(req.body).then(r => res.send(r.length > 0 ? r : []));
});
app.get('/api/diagnosis/:id', (req, res) => {
  neo.getDiagnosis(req.params.id).then(r => res.send(r.length > 0 ? r : []));
});
app.get('/api/samples', (req, res) => {
  neo.getSamples().then(r => res.send(r.length > 0 ? r : []));
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
