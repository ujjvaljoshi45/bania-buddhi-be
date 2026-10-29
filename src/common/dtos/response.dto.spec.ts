import { HttpStatus } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { ResponseDto } from './response.dto.js';

describe('ResponseDto', () => {
  it('should create a success response with default status OK', () => {
    const data = { id: 1, name: 'Item' };
    const response = ResponseDto.success(data, 'Loaded');

    expect(response.data).toEqual(data);
    expect(response.message).toBe('Loaded');
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('should create an error response with default status INTERNAL_SERVER_ERROR', () => {
    const response = ResponseDto.error(null, 'Failed');

    expect(response.data).toBeNull();
    expect(response.message).toBe('Failed');
    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should accept custom HTTP status codes', () => {
    const response = ResponseDto.error(null, 'Bad Request', HttpStatus.BAD_REQUEST);

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });
});

