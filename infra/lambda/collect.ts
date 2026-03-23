import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;
if (!TABLE_NAME) {
  throw new Error('TABLE_NAME is required');
}

// Strip leading characters that Excel/Sheets treat as formula triggers.
// Applied to name (all triggers) and email (all except '+', which is valid in addresses).
const FORMULA_CHARS = /^[=+\-@|%]+/;
const FORMULA_CHARS_EMAIL = /^[=\-@|%]+/;

function sanitizeName(value: string): string {
  return value.replace(FORMULA_CHARS, '').trim();
}

function sanitizeEmail(value: string): string {
  return value.replace(FORMULA_CHARS_EMAIL, '').trim();
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const handler = async (event: Record<string, unknown>) => {
  const ctx = (event.requestContext as Record<string, unknown>)?.http as Record<string, string> | undefined;
  const method = ctx?.method ?? '';
  const pathParams = (event.pathParameters ?? {}) as Record<string, string>;

  // PATCH /collect/{id}  — store final placement scores
  if (method === 'PATCH') {
    const id = pathParams.id ?? '';
    if (!UUID_RE.test(id)) {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'invalid id' }) };
    }
    let scores: Record<string, unknown> = {};
    try {
      const raw = typeof event.body === 'string' ? event.body : '';
      scores = raw ? JSON.parse(raw) : {};
    } catch {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'invalid JSON body' }) };
    }
    try {
      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET scores = :scores, completedAt = :completedAt',
        ExpressionAttributeValues: {
          ':scores': scores,
          ':completedAt': new Date().toISOString(),
        },
        ConditionExpression: 'attribute_exists(id)',
      }));
      return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ok: true }) };
    } catch (err: unknown) {
      const name = (err as { name?: string }).name;
      if (name === 'ConditionalCheckFailedException') {
        return { statusCode: 404, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'record not found' }) };
      }
      console.error(err);
      return { statusCode: 500, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Internal server error' }) };
    }
  }

  // POST /collect  — create a new record
  try {
    const rawBody = typeof event.body === 'string' ? event.body : '';

    let body: Record<string, unknown> = {};
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'invalid JSON body' }) };
      }
    }

    const name = sanitizeName(typeof body.name === 'string' ? body.name : '');
    const email = sanitizeEmail(typeof body.email === 'string' ? body.email : '').toLowerCase();

    if (!name) {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'name is required' }) };
    }
    if (name.length > 100) {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'name is too long' }) };
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'a valid email is required' }) };
    }
    if (email.length > 254) {
      return { statusCode: 400, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'email is too long' }) };
    }

    const item = {
      id: randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return { statusCode: 201, headers: { 'content-type': 'application/json' }, body: JSON.stringify(item) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};