### This backend was created with Express.js for user profiles, which are connected to a PDF files collection in a MongoDB database.

All endpoints use cookies and expects active session, exept one endpoint wich creates new user account

## Endpoints:

### **_`Users        `_**

- To create a new user account, send a POST request to `/users/register`.

```
expect
{
    "name": string,
    "email": string,
    "password": string
}

```

- To authenticate a user, send a POST request to `/users/login`.

```
expect
{
    "email": string,
    "password": string
}
```

- To log out, send a POST request to `/users/logout`.

```
expect: none
```

- To get the current user, send a GET request to `/users/current`.

```
expect: none
```

- To get a current user data with all his files, send a GET request with ID to `/users/:id`.

```
expect: params: {"id": string}
```

- To update a current user info, send a PATCH request with ID to `/users/:id`.

```
expect at least one fields to update:
    params: {"id": string},
    body: {"name": string, "password": string }
```

- To update a current user photo, send a PATCH request with ID to `/users/:id`.

```
expect:
    params: {"id": string},
    contenet-type: multipart/form-data,
    body: {"file": file } - file type 'image/'
```

#

### **_`Files       `_**

- To get all visible files from shared collection, send a GET request to `/api/files`.

```
expect: none
```

- To post PDF file, send a POST request to `/api/files`.

```
    contenet-type: multipart/form-data,
    body: {"file": file, "userId": string } - file type 'application/pdf'
```

- To get file by his ID, send a GET request to `/api/files/:id`.

```
expect: params: {"id": string}
```

- To change file's visibilty key, send a PATCH request to `/api/files/:id`.

```
expect:
    params: {"id": string},
    body: {"visibility": boolean}
```

- To delete only user's file from the collection, send a PATCH request with file ID to `/api/files/:id`.

```
expect: params: {"id": string}
```
