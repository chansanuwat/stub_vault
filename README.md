# QE_Stub_Vault

## Synopsis
Service to create and request API stubs for testing

## Prerequisites
NodeJS<br />
NPM<br />
MongoDB

## Setup
From inside the QE_Stub_Vault directory:
```
$ npm install
```

Connect MongoDB
```
$ mongod --dbpath <path QE_Stub_Vault data folder>
```

Start the Service
```
$ npm start
```

## Usage

### Creating a stub
To create a new stub, simply POST to http://\<server\>/stubs with the following JSON:
```
{
  "path": "<DESIRED PATH>",
  "response": <DESIRED JSON RESPONSE>
}
```

For example: If you want to mock the endpoint '/services/available' with the response '[{"logging": {"active": true}},{"storage": {"active":false}}]', then you would post the following:
```
{
  "path": "/services/available",
  "response: [
    {
      "logging": {"active": true}
    },
    {
      "storage": {"active":false}
    }
  ]
}
```

### Using a stub
To use a stub, simply make a request to the endpoint like http://\<server\>/services/available. This will return whatever is stored for the response value.

### Viewing all stubs
To view all available stubs, simply make a get request to http://\<server\>/stubs

### Deleting a stub
To delete a stub, make a DELETE request to http://\<server\>/stubs with the following JSON:
```
{
  "path": "<STORED PATH>"
}
```
