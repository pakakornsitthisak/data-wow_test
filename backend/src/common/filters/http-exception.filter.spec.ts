import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test/endpoint',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Test error message', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test/endpoint',
      message: 'Test error message',
    });
  });

  it('should handle HttpException with response object', () => {
    const exception = new HttpException(
      { message: 'Validation failed', errors: ['Field 1 is required'] },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    // The filter extracts message from the response object if it exists
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test/endpoint',
      message: 'Validation failed', // Extracted from response object's message property
    });
  });

  it('should handle non-HttpException errors', () => {
    const exception = new Error('Internal server error');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test/endpoint',
      message: 'Internal server error',
    });
  });

  it('should include timestamp in response', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    const beforeTime = new Date().toISOString();

    filter.catch(exception, mockArgumentsHost);

    const afterTime = new Date().toISOString();
    const callArgs = mockResponse.json.mock.calls[0][0];

    expect(callArgs.timestamp).toBeDefined();
    expect(callArgs.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(new Date(callArgs.timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(beforeTime).getTime(),
    );
    expect(new Date(callArgs.timestamp).getTime()).toBeLessThanOrEqual(
      new Date(afterTime).getTime(),
    );
  });

  it('should include request path in response', () => {
    mockRequest.url = '/concerts/123';
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/concerts/123',
      }),
    );
  });

  it('should handle NotFoundException', () => {
    const exception = new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
      }),
    );
  });

  it('should handle BadRequestException', () => {
    const exception = new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad request',
      }),
    );
  });

  it('should extract message from response object', () => {
    const responseObj = {
      message: 'Custom error message',
      statusCode: HttpStatus.BAD_REQUEST,
    };
    const exception = new HttpException(responseObj, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    // The filter extracts message from response object if it exists
    expect(mockResponse.json).toHaveBeenCalled();
    const callArgs = mockResponse.json.mock.calls[0][0];
    expect(callArgs.message).toBe('Custom error message');
  });

  it('should handle HttpException with array message', () => {
    const exception = new HttpException(['Error 1', 'Error 2'], HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    // When message is an array, it stays as array (typeof check fails)
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test/endpoint',
      message: ['Error 1', 'Error 2'],
    });
  });

  it('should handle HttpException with object response without message property', () => {
    const responseObj = {
      errors: ['Field 1 is required'],
    };
    const exception = new HttpException(responseObj, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    // When response object has no message property, it uses the whole object
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test/endpoint',
      message: responseObj, // Uses the whole object if no message property
    });
  });
});

