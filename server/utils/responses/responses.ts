export class Responses {
  constructor() {}

  public notFound() {
    return {
      message: 'Not found!',
      status: 404,
      device_id: null,
      tokens: null,
    };
  }

  public success(device_id: string, token1: string, token2: string) {
    return {
      message: 'Succesfull',
      status: 200,
      device_id: device_id,
      tokens: {
        access: token1,
        refresh: token2,
      },
    };
  }

  public serverError() {
    return {
      message: 'Error occured',
      status: 500,
      device_id: null,
      tokens: null,
    };
  }

  public dataIsUsed() {
    return {
      message: "Data you've entered is used",
      status: 423,
      device_id: null,
      tokens: null,
    };
  }
}
