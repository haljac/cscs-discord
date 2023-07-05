import 'dotenv/config';
import crypto from 'crypto';
import { DynamoDBClient, BatchExecuteStatementCommand } from '@aws-sdk/client-dynamodb';
import problems from './problems.json' assert { type: 'json' };

console.log(problems.length);

const client = new DynamoDBClient({ region: 'us-east-1', debug: true });

let idx = 0;

let statements = [];

for (const problem of problems) {
  statements.push({
    Statement: 'INSERT INTO "cscs-problems" VALUE {\'id\' : ?, \'name\' : ?, \'url\' : ?, \'pattern\' : ?, \'difficulty\' : ? }',
    Parameters: [
      { 
        S: crypto.randomUUID() // id
      },
      {
        S: problem.problem // name
      },
      {
        S: "https://leetcode.com/problems/" + problem.link // name
      },
      {
        S: problem.pattern // name
      },
      {
        S: problem.difficulty // name
      },
    ]
  })

  if (statements.length === 25 || idx === problems.length - 1) {
    console.log(`sending ${statements.length} records: idx: ${idx}`);
    const input = {
      Statements: statements,
      ReturnConsumedCapacity: "TOTAL",
    };

    const command = new BatchExecuteStatementCommand(input);

    (async () => {
      try {
        const response = await client.send(command);
        console.log(JSON.stringify(response));
      } catch(err) {
        console.error('Error', err.message)
      }
    })()

    statements = [];
  }

  idx += 1;
}



