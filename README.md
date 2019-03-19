# CDDS-App
A Simple clinical decision support app.

#### Load Diagnosis nodes
```
LOAD CSV WITH HEADERS FROM "https://gist.githubusercontent.com/scrombie/0a354679708214ee43c859f9d07cbb01/raw/cdca15b1401288bf776d6d3302cd3ff7614e01cc/diagnosis.csv" AS csvLine
CREATE (d:Diagnosis { id: csvLine.id, name: csvLine.name })
```

#### Load Symptom nodes
```
LOAD CSV WITH HEADERS FROM "https://gist.githubusercontent.com/scrombie/6c350b2ab247ba705d0e642c811bb1c5/raw/93adf48e9badaf5b7e8052aa7dad7ea34e7fa72b/symptoms.csv" AS csvLine
CREATE (s:Symptom { id: csvLine.id, name: csvLine.name })
```

#### Create Unique Constraints (Optional)
```
CREATE CONSTRAINT ON (d:Diagnosis) ASSERT d.id IS UNIQUE
```

```
CREATE CONSTRAINT ON (s:Symptom) ASSERT s.id IS UNIQUE
```

#### Load Symptom - Diagnosis Relationships
```
USING PERIODIC COMMIT 500
LOAD CSV WITH HEADERS FROM "https://gist.githubusercontent.com/scrombie/7d911cbd9b46ccf85dedcfe61f17ca98/raw/797f72698b94d8d5878f090de40c17593d8de9f6/dia_sym_relationship.csv" AS csvLine
MATCH (s:Symptom { id: csvLine._from}),(d:Diagnosis { id: csvLine._to})
CREATE (s)-[:SYMPTOM_OF]->(d)
```