# OpenAPI Mock Generator
![GitHub License](https://img.shields.io/github/license/migudevelop/openapi-mock-generator)

## Overview
The OpenAPI Mock Generator is a Node.js-based tool designed to generate mock data and APIs from OpenAPI specifications. It simplifies the process of creating mock servers for testing and development purposes, ensuring that developers can simulate API behavior without relying on live services.

## Features
- **Mock Data Generation**: Automatically generate mock data based on OpenAPI schemas.
- **Mock API Server**: Spin up a mock server to simulate API endpoints.
- **Customizable Responses**: Configure custom responses for specific endpoints.
- **Support for Multiple OpenAPI Versions**: Compatible with OpenAPI 2.0, 3.0, and beyond.

## Installation
To install the dependencies, use the following command:

```bash
pnpm install
```

## Usage
1. Place your OpenAPI specification files in the `openapi/` directory.
2. Run the following command to start the mock server:

```bash
pnpm start
```

3. Access the mock server at `http://localhost:3000` (default port).

## Using @faker-js/faker for Mock Data

The OpenAPI Mock Generator supports the use of the `@faker-js/faker` library to generate realistic mock data. You can define custom mock data in your OpenAPI specification by using `x-faker` extensions.

### Example

In your OpenAPI specification, add the `x-faker` extension to specify the Faker.js method for generating data:

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          x-faker: datatype.uuid
        name:
          type: string
          x-faker: name.findName
        email:
          type: string
          x-faker: internet.email
```

### How It Works

1. The generator reads the `x-faker` extensions in your OpenAPI specification.
2. It uses the specified Faker.js methods to generate mock data for the corresponding fields.
3. The mock server will return the generated data when the API is called.

### Faker.js Documentation

For a full list of available Faker.js methods, refer to the [@faker-js/faker documentation](https://fakerjs.dev/).

By leveraging `@faker-js/faker`, you can create more realistic and meaningful mock data for your APIs.

## Project Structure
- **src/**: Contains the source code, including helpers and library modules.
  - `helppers/`: Utility functions for configuration, file handling, logging, and string manipulation.
  - `lib/`: Core logic for mock generation and OpenAPI reading.
- **mocks/**: Predefined mock schemas for testing.
- **openapi/**: OpenAPI specification files.
- **coverage/**: Code coverage reports.

## Testing
Run the test suite using:

```bash
pnpm test
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the Apache 2.0 License. See the `LICENSE` file for details.

## Acknowledgments
Special thanks to the open-source community for providing tools and libraries that make this project possible.
