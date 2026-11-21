// სპექტაკლის ფორმაში ჩაშენებული განრიგი (Showtime ჩანაწერები).
// მნიშვნელობა JSON სტრიქონად მიდის სერვერზე, იქ ხდება შენახვა (იხ. resources.ts → showtimesHooks).
import { Box, Button, FormGroup, Icon, Input, Label, Text } from '@adminjs/design-system';
import React, { useEffect, useState } from 'react';

const parse = (value) => {
  try {
    const rows = JSON.parse(value || '[]');
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
};

// ISO (UTC) → datetime-local ველის ფორმატი ადგილობრივ დროში
const toLocalInput = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const toIso = (local) => {
  if (!local) return '';
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
};

const EMPTY = { startsAt: '', venueKa: '', venueEn: '', ticketUrl: '' };

const ShowtimesEdit = ({ property, record, onChange }) => {
  const [rows, setRows] = useState(() => parse(record.params[property.path]));

  useEffect(() => {
    onChange(property.path, JSON.stringify(rows));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const update = (index, field, value) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  const remove = (index) => setRows((current) => current.filter((_, i) => i !== index));
  const add = () => setRows((current) => [...current, { ...EMPTY }]);

  const error = record.errors?.[property.path];

  return (
    <FormGroup error={!!error}>
      <Label>განრიგი (ჩვენებები)</Label>
      {!rows.length && (
        <Text mb="default" color="grey60">
          ჩვენება ჯერ არ არის დამატებული.
        </Text>
      )}
      {rows.map((row, index) => (
        <Box
          key={row.id ?? `new-${index}`}
          variant="grey"
          p="lg"
          mb="default"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
            gap: 12,
            alignItems: 'end',
          }}
        >
          <Box>
            <Label required>თარიღი და დრო</Label>
            <Input
              type="datetime-local"
              width={1}
              value={toLocalInput(row.startsAt)}
              onChange={(e) => update(index, 'startsAt', toIso(e.target.value))}
            />
          </Box>
          <Box>
            <Label>სცენა / ადგილი (ქართ.)</Label>
            <Input
              width={1}
              value={row.venueKa ?? ''}
              onChange={(e) => update(index, 'venueKa', e.target.value)}
            />
          </Box>
          <Box>
            <Label>Venue (EN)</Label>
            <Input
              width={1}
              value={row.venueEn ?? ''}
              onChange={(e) => update(index, 'venueEn', e.target.value)}
            />
          </Box>
          <Box>
            <Label>ბილეთების ლინკი</Label>
            <Input
              width={1}
              value={row.ticketUrl ?? ''}
              onChange={(e) => update(index, 'ticketUrl', e.target.value)}
            />
          </Box>
          <Button type="button" variant="danger" size="icon" onClick={() => remove(index)}>
            <Icon icon="Trash2" />
          </Button>
        </Box>
      ))}
      <Button type="button" variant="outlined" onClick={add}>
        <Icon icon="Plus" />
        ჩვენების დამატება
      </Button>
      {error && (
        <Text mt="default" color="error">
          {error.message}
        </Text>
      )}
    </FormGroup>
  );
};

export default ShowtimesEdit;
