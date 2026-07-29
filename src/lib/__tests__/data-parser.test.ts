import { describe, it, expect } from 'vitest';
import {
  parseCSV,
  parseJSON,
  generateSampleData,
  generateRandomData,
} from '../data-parser';

describe('parseCSV', () => {
  it('parses a basic CSV with a header and data rows', () => {
    const data = parseCSV('Month,Revenue,Expenses\nJan,100,50\nFeb,200,80');
    expect(data.labels).toEqual(['Jan', 'Feb']);
    expect(data.datasets).toHaveLength(2);
    expect(data.datasets[0].name).toBe('Revenue');
    expect(data.datasets[0].values).toEqual([100, 200]);
    expect(data.datasets[1].values).toEqual([50, 80]);
  });

  it('handles quoted fields that contain commas', () => {
    const data = parseCSV('Label,Value\n"Smith, John",42');
    expect(data.labels).toEqual(['Smith, John']);
    expect(data.datasets[0].values).toEqual([42]);
  });

  it('handles CRLF line endings and escaped quotes', () => {
    const data = parseCSV('Label,Value\r\n"He said ""hi""",7\r\n');
    expect(data.labels).toEqual(['He said "hi"']);
    expect(data.datasets[0].values).toEqual([7]);
  });

  it('coerces non-numeric cells to 0', () => {
    const data = parseCSV('Label,Value\nA,notanumber\nB,10');
    expect(data.datasets[0].values).toEqual([0, 10]);
  });

  it('throws when there is no data row', () => {
    expect(() => parseCSV('OnlyHeader')).toThrow();
  });
});

describe('parseJSON', () => {
  it('parses an array of objects', () => {
    const json = JSON.stringify([
      { month: 'Jan', sales: 10 },
      { month: 'Feb', sales: 20 },
    ]);
    const data = parseJSON(json);
    expect(data.labels).toEqual(['Jan', 'Feb']);
    expect(data.datasets[0].name).toBe('sales');
    expect(data.datasets[0].values).toEqual([10, 20]);
  });

  it('parses pre-formatted chart data', () => {
    const json = JSON.stringify({
      labels: ['A', 'B'],
      datasets: [{ name: 'X', values: [1, 2] }],
    });
    const data = parseJSON(json);
    expect(data.labels).toEqual(['A', 'B']);
    expect(data.datasets[0].name).toBe('X');
    expect(data.datasets[0].visible).toBe(true);
  });

  it('throws on an unrecognized shape', () => {
    expect(() => parseJSON(JSON.stringify({ foo: 'bar' }))).toThrow();
  });
});

describe('sample/random generators', () => {
  it('generateSampleData keeps every dataset aligned to the labels', () => {
    const data = generateSampleData();
    expect(data.labels.length).toBeGreaterThan(0);
    data.datasets.forEach((ds) =>
      expect(ds.values).toHaveLength(data.labels.length)
    );
  });

  it('generateRandomData respects the requested dimensions', () => {
    const data = generateRandomData(6, 3);
    expect(data.labels).toHaveLength(6);
    expect(data.datasets).toHaveLength(3);
    data.datasets.forEach((ds) => expect(ds.values).toHaveLength(6));
  });
});
