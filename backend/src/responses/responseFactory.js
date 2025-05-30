import {
  OkResponse,
  CreatedResponse,
  UpdateResponse,
  DeleteResponse
} from './success.response.js';

import {
  NotFoundRequest,
  ConflictRequest,
  BadRequest,
  ForbiddenRequest,
  UnauthorizedRequest,
  InternalServerError,
  NotImplemented,
} from './error.response.js';

import {ResponseTypes} from './response.types.js';

class ResponseFactory {
  static create(type, options) {
    switch (type) {
      // ✅ Success responses
      case ResponseTypes.SUCCESS:
        return new OkResponse(options);
      case ResponseTypes.CREATED:
        return new CreatedResponse(options);
      case ResponseTypes.UPDATED:
        return new UpdateResponse(options);
      case ResponseTypes.DELETED:
        return new DeleteResponse(options);

      // ❌ Error responses
      case ResponseTypes.BAD_REQUEST:
        return new BadRequest(options);
      case ResponseTypes.UNAUTHORIZED:
        return new UnauthorizedRequest(options);
      case ResponseTypes.FORBIDDEN:
        return new ForbiddenRequest(options);
      case ResponseTypes.NOT_FOUND:
        return new NotFoundRequest(options);
      case ResponseTypes.CONFLICT:
        return new ConflictRequest(options);
      case ResponseTypes.INTERNAL_ERROR:
        return new InternalServerError(options);
      case ResponseTypes.NOT_IMPLEMENTED:
        return new NotImplemented(options);

      default:
        throw new Error(`Unknown response type: ${type}`);
    }
  }
}

export default ResponseFactory;
