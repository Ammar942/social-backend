export class ResponseHelper {
  static success(data: any, message = 'OK') {
    return {
      success: true,
      message,
      data,
    };
  }
}
