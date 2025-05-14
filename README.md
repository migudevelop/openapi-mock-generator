# OpenAPI Mock Generator CLI
![GitHub License](https://img.shields.io/github/license/migudevelop/openapi-mock-generator-cli)

## Overview
OpenAPI Mock Generator CLI is a Node.js-based tool designed to generate mock data from OpenAPI specifications. It simplifies the process of creating mock data for testing and development purposes, ensuring that developers can simulate the OpenAPI response as realistically as possible.

## Features
- **Mock Data Generation**: Automatically generate mock data based on OpenAPI schemas.
- **Support for Multiple OpenAPI Versions**: Compatible with OpenAPI 2.0, 3.0, and beyond.

## Prerequisites
- [Node.js](https://nodejs.org/) >= 22.x

## Installation
To install the dependencies, use the following command:

```bash
pnpm install
```

Optionally, install the CLI globally:

```bash
pnpm add -g openapi-mock-generator-cli
```

## Usage

### Command Line Interface (CLI)
1. Place your OpenAPI specification files in the `openapi/` directory or configure the path in the `openapiMockGenerator.config.json` file using the **openApiFilesPath** property.    
   - The generator will look for OpenAPI files in the specified directory.
   - You can also specify the mock data output directory in the configuration file using **outputSchemasPath** property. The default output directory is `mocks/`.
2. Run the following command to generate mock data:

```bash
#npm
npx openapi-mock-generator-cli

# pnpm
pnpm dlx openapi-mock-generator-cli 
```

### Or if you have installed in your project
```bash
#npm
npm run openapi-mock-generator-cli
# pnpm
pnpm openapi-mock-generator-cli
```

#### Supported Configuration File Names

The CLI will automatically look for a configuration file in your project root.  
You can use any of the following names and formats:

| JSON                | YAML/YML                  | JavaScript/TypeScript      |
|---------------------|---------------------------|----------------------------|
| openapiMockGenerator.json           | openapiMockGenerator.yaml           | openapiMockGenerator.js           |
| openapiMockGenerator.config.json    | openapiMockGenerator.config.yaml    | openapiMockGenerator.config.js    |
|           | openapiMockGenerator.yml     | openapiMockGenerator.ts           |
|                                 |  openapiMockGenerator.config.yml  | openapiMockGenerator.config.ts    |

> **Tip:** This flexibility allows you to choose the format that best fits your workflow or CI/CD pipeline.

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

