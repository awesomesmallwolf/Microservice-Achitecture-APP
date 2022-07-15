export const natsWrapper = {
  // fake implementation of publish function
  // client: {
  //   publish: (subject: string, data: string, callback: () => void) => {
  //     callback();
  //   }
  // }

  // creating a mock
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback();
    })
  }
};