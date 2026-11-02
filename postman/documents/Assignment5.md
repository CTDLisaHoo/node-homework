### Health Check
**Method:** GET  
**Endpoint:** [http://localhost:3000/health](http://localhost:3000/health)  
**Status:** 🟢 `200 OK – PASSED`  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/health'
 ```
**Request Body:**
``` json
{"status":"ok","db":"connected"}
 ```

### Register User 1
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/register](http://localhost:3000/api/users/register)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Test User One",
  "email": "user1@example.com",
  "password": "Test123456!"
}'
 ```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**
``` json
{"name":"Test User One","email":"user1@example.com"}
 ```

### Test duplicate registration
*Repeat User 1 registration using the same email.*  
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/register](http://localhost:3000/api/users/register)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \ --header 'Content-Type: application/json' \ --data-raw '{ "name": "Test User One", "email": "user1@example.com", "password": "Test123456!" }'` 
 ```
**Status:** 🔴 `400 BAD REQUEST`  
**Request Body:**  
```json 
{"message":"Email already registered"}
```

### Register User 2
**Method:** POST
**Endpoint:** [http://localhost:3000/api/users/register](http://localhost:3000/api/users/register)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \ --header 'Content-Type: application/json' \ --data-raw '{ "name": "Test User Two", "email": "user2@example.com", "password": "Test123456!" }'`  
 ```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:** 
 ```json
{"name":"Test User Two","email":"user2@example.com"}
 ```

### Logon as User 1
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logon](http://localhost:3000/api/users/logon)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user1@example.com",
  "password": "Test123456!"
}'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"Test User One","email":"user1@example.com"}
 ```

### Create a task with the title is more than 30 character
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks' \
--header 'Content-Type: application/json' \
--data '{
  "title": "User 1 - Assignment 5 completed",
  "isCompleted": false
}'
 ```
**Status:** 🔴 `400 BAD REQUEST`  
**Request Body:**
``` json
{"error":"\"title\" length must be less than or equal to 30 characters long"}
 ```

### Create a task for User 1
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Assignment 5 Completed",
  "isCompleted": false
}'
 ```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**
``` json
{"id":1,"title":"Assignment 5 Completed","isCompleted":false}
 ```

### Update User 1's task
**Method:** PATCH  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/1' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Assignment 5 Updated",
  "isCompleted": true
}'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"id":1,"title":"Assignment 5 Updated","is_completed":true}
 ```

### Logoff User 1
**Method:** POST
**Endpoint:** [http://localhost:3000/api/users/logoff](http://localhost:3000/api/users/logoff)  
**Curl Command:**  
```bash 
curl --location --request POST 'http://localhost:3000/api/users/logoff'`  
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**  
```json 
{"message":"User logged off successfully"}`
```

### Logon as User 2
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logon](http://localhost:3000/api/users/logon)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user2@example.com",
  "password": "Test123456!"
}'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"Test User Two","email":"user2@example.com"}
```

### User 2 tries to show User 1's task
**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/1'
```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"No matching task exists."}
```

### User 2 – List tasks
**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks'
```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"The user has no tasks"}
```

### User 2 tries to update User 1's task
**Method:** PATCH  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/1' \
--header 'Content-Type: application/json' \
--data '{
  "title": "User 2 changed task",
  "isCompleted": true
}'
 ```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"No matching task exists."}
```

### Logoff User 2
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logoff](http://localhost:3000/api/users/logoff)  
**Curl Command:**
``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"message":"User logged off successfully"}
```

### Logon as User 1
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logon](http://localhost:3000/api/users/logon)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user1@example.com",
  "password": "Test123456!"
}'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"Test User One","email":"user1@example.com"}
```

### Verify User 1's task still exists
**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/1'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"id":1,"title":"Assignment 5 Updated","is_completed":true}
```

### List tasks
**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
[{"id":1,"title":"Assignment 5 Updated","is_completed":true}]
```

### Delete task 1
**Method:** DELETE  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location --request DELETE 'http://localhost:3000/api/tasks/1'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"id":1,"title":"Assignment 5 Updated","is_completed":true}
```

### Verify deletion
**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1)  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/1'
```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"No matching task exists."}
```

### Logoff User 1
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logoff](http://localhost:3000/api/users/logoff)  
**Curl Command:**
``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'
```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"message":"User logged off successfully"}
 ```