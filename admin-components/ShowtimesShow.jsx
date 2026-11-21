import { FormGroup, Label, Table, TableBody, TableCell, TableHead, TableRow, Text } from '@adminjs/design-system';
import React from 'react';

const parse = (value) => {
  try {
    const rows = JSON.parse(value || '[]');
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};

const ShowtimesShow = ({ property, record }) => {
  const rows = parse(record.params[property.path]);
  return (
    <FormGroup>
      <Label>განრიგი (ჩვენებები)</Label>
      {!rows.length ? (
        <Text color="grey60">ჩვენება არ არის დამატებული.</Text>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>თარიღი და დრო</TableCell>
              <TableCell>სცენა / ადგილი</TableCell>
              <TableCell>ბილეთები</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{new Date(row.startsAt).toLocaleString('ka-GE')}</TableCell>
                <TableCell>{row.venueKa || '—'}</TableCell>
                <TableCell>
                  {row.ticketUrl ? (
                    <a href={row.ticketUrl} target="_blank" rel="noreferrer">
                      ლინკი
                    </a>
                  ) : (
                    '—'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </FormGroup>
  );
};

export default ShowtimesShow;
