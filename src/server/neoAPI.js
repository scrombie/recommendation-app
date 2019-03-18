const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'graph')
);
let session;

const LABEL_SYMPTOM = 'Symptom';
const LABEL_DIAGNOSIS = 'Diagnosis';
const REL_SYMPTOM_OF = 'SYMPTOM_OF';

const idKey = 'id';

function openSession() {
  session = driver.session();
  return session;
}

function closeSession(closeDriver) {
  if (session) session.close();
  if (closeDriver) {
    driver.close();
  }
}

function runQuery(queryString) {
  return openSession()
    .run(queryString)
    .then((r) => {
      closeSession(true);
      return r.records.map(record => record.toObject());
    })
    .catch((e) => {
      console.log('ERROR RUNNING QUERY', e);
      closeSession(true);
    });
}

// find diagnosis with exactly the symptoms given (must be more than one)
function findDiagnosisWithExactSymptoms(symptomIDs) {
  return runQuery(`
      WITH ${JSON.stringify(symptomIDs)} as symptomInput
      MATCH (s:${LABEL_SYMPTOM}) WHERE s.id in symptomInput
      WITH collect(s) as symptoms
      WITH head(symptoms) as s1, tail(symptoms) as symptoms
      MATCH (s1)-[:${REL_SYMPTOM_OF}]->(d:${LABEL_DIAGNOSIS})
      WHERE ALL(s in symptoms WHERE (s)-[:${REL_SYMPTOM_OF}]->(d))
      RETURN d.name AS name, d.id AS id
    `);
}

// return symptom vertices
function getSymptoms(symptoms) {
  const where = symptoms && symptoms.length > 0
    ? ` WHERE s.name IN ${JSON.stringify(symptoms)} `
    : '';

  return runQuery(
    `MATCH (s:${LABEL_SYMPTOM}) ${where} RETURN s.id AS id, s.name AS name`
  );
}

function findPossibleDiagnosisBySymptoms(symptomIDs) {
  // console.log("FindPossibleDiagnosisBySymptom ARG",symptomIDs);

  return runQuery(
    ` 
      MATCH (s:${LABEL_SYMPTOM}) WHERE s.${idKey} IN ${JSON.stringify(symptomIDs)}
      MATCH (s)-[:${REL_SYMPTOM_OF}]->(d)
      RETURN d.id AS id, d.name AS name
    `
  );
}

function search(query, filter) {
  let label = '';
  if (filter) {
    label = filter === 'diagnosis' ? `:${LABEL_DIAGNOSIS}` : `:${LABEL_SYMPTOM}`;
  }
  return runQuery(`MATCH (n${label}) WHERE n.name =~ '(?i).*${query}.*' RETURN n.id as id, n.name as name, labels(n) as type`);
}

// get samples
function getSamples() {
  return runQuery(`
    MATCH (s:${LABEL_SYMPTOM})-[:${REL_SYMPTOM_OF}]->(d)
    WHERE rand() < 0.70
    WITH d, COLLECT({id:s.id,name:s.name}) as symptoms, COUNT(s) as sCount
    WHERE sCount > 2 AND sCount <= 5
    RETURN d.id AS id, d.name AS name, symptoms ORDER BY d.id LIMIT 5
  `);
  // return runQuery(
  //   `
  //     MATCH (s:Symptom)-[:SYMPTOM_OF]->(d:Diagnosis)
  //     WITH d, COLLECT({id:s.id,name:s.name}) as symptoms
  //     WHERE SIZE(symptoms) <= 5
  //     RETURN d.id AS id, d.name AS name, symptoms LIMIT 5
  //   `
  // );
}

// search for diagnosis by name
function findDiagnosis(diagnosisNames) {
  const where = diagnosisNames && diagnosisNames.length > 0
    ? ` WHERE s.name IN ${JSON.stringify(diagnosisNames)} `
    : '';

  return runQuery(
    `MATCH (s:${LABEL_DIAGNOSIS}) ${where} RETURN s.id AS id, s.name AS name`
  );
}

// get all possible symptoms for a range of diagnosis (must be more than one)
function findAssociatedSymptoms(diagnosisIDs) {
  // console.log("GET ASSOCIATED SYMPTOMS ARG",diagnosisIDs);

  return runQuery(
    `
      MATCH (d:${LABEL_DIAGNOSIS}) WHERE d.id IN ${JSON.stringify(diagnosisIDs)}
      MATCH (s:${LABEL_SYMPTOM})-[:${REL_SYMPTOM_OF}]->(d)
      RETURN DISTINCT s.id AS id, s.name AS name
    `
  );
}

function getSymptom(symptomId) {
  return runQuery(
    `
    MATCH (s:Symptom {id:'${symptomId}'})-[:${REL_SYMPTOM_OF}]->(d)
    WITH s, COLLECT({id:d.id, name:d.name}) AS diagnosis
    RETURN s.id AS id, s.name AS name, diagnosis
    `
  );
}


// get the symptoms of a diagnosis
function getDiagnosis(diagnosisId) {
  // console.log("GET DIAGNOSIS SYMPTOMS",diagnosisId);
  return runQuery(
    `   
    MATCH (s)-[:${REL_SYMPTOM_OF}]->(d:${LABEL_DIAGNOSIS} {id:'${diagnosisId}'})
    WITH d, COLLECT({id:s.id, name:s.name}) AS symptoms
    RETURN d.id AS id, d.name AS name, symptoms 
    `
  );
}


module.exports = {
  idKey,
  search,
  findAssociatedSymptoms,
  findDiagnosis,
  getDiagnosis,
  getSymptom,
  findDiagnosisWithExactSymptoms,
  findPossibleDiagnosisBySymptoms,
  getSymptoms,
  getSamples
};
