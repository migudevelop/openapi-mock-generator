# OpenAPI Mock Generator CLI
![GitHub License](https://img.shields.io/github/license/migudevelop/openapi-mock-generator)

## Overview
OpenAPI Mock Generator CLI is a Node.js-based tool designed to generate mock data from OpenAPI specifications. It simplifies the process of creating mock data for testing and development purposes, ensuring that developers can simulate the OpenAPI response as realistically as possible.

## Features
- **Mock Data Generation**: Automatically generate mock data based on OpenAPI schemas.
- **Support for Multiple OpenAPI Versions**: Compatible with OpenAPI 2.0, 3.0, and beyond.

## Installation
To install the dependencies, use the following command:

```bash
pnpm install
```

## Usage

### Command Line Interface (CLI)
1. Place your OpenAPI specification files in the `openapi/` directory or configure the path in the `openapiMockGenerator.config.json` file using the **openApiFilesPath** property. 
   - The generator will look for OpenAPI files in the specified directory.
   - You can also specify the mock data output directory in the configuration file using **outputSchemasPath** property. The default output directory is `mocks/`.
2. Run the following command to generate mock data:

```bash
#npm
npx openapi-mock-generator

# pnpm
pnpm dlx openapi-mock-generator 
```

### Or if you have installed in your project
```bash
#npm
npm run openapi-mock-generator
# pnpm
pnpm openapi-mock-generator
```


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

## License
This project is licensed under the Apache 2.0 License. See the `LICENSE` file for details.

