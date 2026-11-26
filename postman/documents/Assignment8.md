### Health Check
**Method:** GET  
**Endpoint:** http://localhost:3000/health  
**Status:** 🟢 `200 OK – PASSED`  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/health'
 ```
**Request Body:**
``` json
{"status":"ok","db":"connected"}
 ```

### Register User 1 (John)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/register
**Script:** Post-response
```js
const response = pm.response.json();
pm.environment.set("csrfToken", response.csrfToken);
console.log("Register CSRF saved:", response.csrfToken);
```
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Cookie: jwt= [REDACTED]  ' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123!"
}'
 ```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**
``` json
{"name":"John","email":"john@example.com","csrfToken":"[REDACTED]",
"welcomeTasks":[
{"id":1,"title":"Complete your profile","isCompleted":false,"userId":1,"priority":"medium"},
{"id":2,"title":"Add your first task","isCompleted":false,"userId":1,"priority":"high"},
{"id":3,"title":"Explore the app","isCompleted":false,"userId":1,"priority":"low"}],
"transactionStatus":"success"}
 ```

### Register User 2 (Jane)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/register
**Script:** Post-response
```js
const response = pm.response.json();
pm.environment.set("csrfToken", response.csrfToken);
console.log("Register CSRF saved:", response.csrfToken);
```
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Cookie: jwt=[REDACTED] ' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}'
```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**
``` json
{"name":"Jane Doe","email":"jane@example.com","csrfToken":"[REDACTED]",
"welcomeTasks":[
{"id":4,"title":"Complete your profile","isCompleted":false,"userId":2,"priority":"medium"},
{"id":5,"title":"Add your first task","isCompleted":false,"userId":2,"priority":"high"},
{"id":6,"title":"Explore the app","isCompleted":false,"userId":2,"priority":"low"}],"transactionStatus":"success"}
 ```

### Test duplicate registration 
_Repeat User 2 (Jane) registration using the same email._  
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/register  
**Script:** Post-response
```js
const response = pm.response.json();
pm.environment.set("csrfToken", response.csrfToken);
console.log("Register CSRF saved:", response.csrfToken);
```
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Cookie: jwt= [REDACTED]  ' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}'
 ```
**Status:** 🔴 `400 BAD REQUEST`  
**Request Body:**
``` json
{"error":"Email already registered"}
 ```

### Show All Users
**Method:** GET  
**Endpoint:** http://localhost:3000/api/analytics/users  
              http://localhost:3000/api/analytics/users?page=1&limit=10
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/analytics/users'
curl --location 'http://localhost:3000/api/analytics/users?page=1&limit=10'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"users":[
{"id":2,"name":"Jane Doe","email":"jane@example.com","createdAt":"2026-11-23T03:11:30.178Z","_count":{"Task":3},"Task":[{"id":4},{"id":5},{"id":6}]},
{"id":1,"name":"John","email":"john@example.com","createdAt":"2026-11-23T02:42:45.257Z","_count":{"Task":3},
"Task":[{"id":1},{"id":2},{"id":3}]}],
"pagination":{"page":1,"limit":10,"total":2,"pages":1,"hasNext":false,"hasPrev":false}}
 ```

### Logon as User 1 (John)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/logon 
**Script:** Post-response
```js
const response = pm.response.json();
pm.environment.set("csrfToken", response.csrfToken);
console.log("Register CSRF saved:", response.csrfToken);
```
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Cookie: jwt= [REDACTED]  ' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "john@example.com",
  "password": "Password123!"
}'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"John","email":"john@example.com","csrfToken":"[REDACTED]"}
 ```

### Create a task for User 1 (John)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/tasks 
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Finish Assignment 8",
  "isCompleted": false
}'
 ```
**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**
``` json
{"id":7,"title":"Finish Assignment 8","isCompleted":false,"priority":"medium"}
 ```

### Get All Tasks 
**Method:** GET  
**Endpoint:** http://localhost:3000/api/tasks 
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"tasks":[
{"id":7,"title":"Finish Assignment 8","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T03:54:23.722Z","User":{"name":"John","email":"john@example.com"}},
{"id":1,"title":"Complete your profile","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T02:42:45.277Z","User":{"name":"John","email":"john@example.com"}},
{"id":2,"title":"Add your first task","isCompleted":false,"priority":"high","createdAt":"2026-11-23T02:42:45.277Z","User":{"name":"John","email":"john@example.com"}},
{"id":3,"title":"Explore the app","isCompleted":false,"priority":"low","createdAt":"2026-11-23T02:42:45.277Z","User":{"name":"John","email":"john@example.com"}}],
"pagination":{"page":1,"limit":10,"total":4,"pages":1,"hasNext":false,"hasPrev":false}}
 ```

### Get One Task
**Method:** GET  
**Endpoint:**  http://localhost:3000/api/tasks/7
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/7' 
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"id":7,"title":"Finish Assignment 8","isCompleted":false,"priority":"medium","User":{"name":"John"}}
 ```

### Update a Task
**Method:** PATCH  
**Endpoint:**  http://localhost:3000/api/tasks/7
**Curl Command:**
``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/7' \
--header 'Content-Type: application/json' \
--data '{
  "isCompleted": true
}'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"title":"Finish Assignment 8","isCompleted":true,"id":7,"priority":"medium"}
 ```

### Logoff User 1 (John)
**Method:** POST  
**Endpoint:**  
**Curl Command:**
``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"message":"User logged off successfully"}
 ```

### Logon as User 2 (Jane)
**Method:** POST  
**Endpoint:**  http://localhost:3000/api/users/logon
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Cookie: jwt= [REDACTED]  ' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "jane@example.com",
  "password": "Password123!"
}'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"Jane Doe","email":"jane@example.com","csrfToken":"[REDACTED]"}
 ```

### User 2 (Jane) List Tasks 
**Method:** GET  
**Endpoint:**  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"tasks":[
{"id":4,"title":"Complete your profile","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T03:11:30.180Z","User":{"name":"Jane Doe","email":"jane@example.com"}},
{"id":5,"title":"Add your first task","isCompleted":false,"priority":"high","createdAt":"2026-11-23T03:11:30.180Z","User":{"name":"Jane Doe","email":"jane@example.com"}},
{"id":6,"title":"Explore the app","isCompleted":false,"priority":"low","createdAt":"2026-11-23T03:11:30.180Z","User":{"name":"Jane Doe","email":"jane@example.com"}}],
"pagination":{"page":1,"limit":10,"total":3,"pages":1,"hasNext":false,"hasPrev":false}}
 ```

### User 2 (Jane) tries to Get User 1 (John)'s task
**Method:** GET  
**Endpoint:**  
**Curl Command:**
``` bash
curl --location --request GET 'http://localhost:3000/api/tasks/1' \
--header 'Content-Type: text/plain' 
 ```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"No matching task exists."}
 ```

### User 2 (Jane) tries to Update User 1 (John)'s task
**Method:** PATCH  
**Endpoint:** http://localhost:3000/api/tasks/3 
**Curl Command:**
``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/3' \
--header 'Content-Type: application/json' \
--data '{
  "isCompleted": true
}'
 ```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"The task was not found."}
 ```

 ### User 2 (Jane) tries to Delete User 1 (John)'s task
**Method:** DELETE  
**Endpoint:** http://localhost:3000/api/tasks/3 
**Curl Command:**
``` bash
curl --location --request DELETE 'http://localhost:3000/api/tasks/3' \
 ```
**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**
``` json
{"message":"No matching task exists."}
 ```

### Logoff User 2 (Jane)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/logoff 
**Curl Command:**
``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"message":"User logged off successfully"}
 ```

### Logon as User 1 (John)
**Method:** POST  
**Endpoint:** http://localhost:3000/api/users/logon 
**Script:** Post-response
```js
const response = pm.response.json();
pm.environment.set("csrfToken", response.csrfToken);
console.log("Register CSRF saved:", response.csrfToken);
```
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "john@example.com",
  "password": "Password123!"
}'
 ```
**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**
``` json
{"name":"John","email":"john@example.com","csrfToken":"[REDACTED]"}
 ```

### Bulk Create Tasks with Titles Exceeding 30 Characters
**Method:** POST  
**Endpoint:**  http://localhost:3000/api/tasks/bulk
**Curl Command:**
```bash
curl --location 'http://localhost:3000/api/tasks/bulk' \
--header 'Cookie: jwt= [REDACTED]  ' \
--header 'Content-Type: application/json' \
--data '{
  "tasks": [
    {
      "title": "Study JavaScript",
      "isCompleted": false,
      "priority": "low"
    },
    {
      "title": "Learn JWT Authentication",
      "isCompleted": false,
      "priority": "medium"
    },
    {
      "title": "Testing JWT Authentication Using Postman ",
      "isCompleted": true,
      "priority": "High"
    }
  ]
}'
 ```
**Status:** 🔴 `400 Bad Request`  
**Request Body:**
``` json
{"error":"Validation failed","details":[{"message":"\"title\" length must be less than or equal to 30 characters long","path":["title"],"type":"string.max","context":{"limit":30,"value":"Testing JWT Authentication Using Postman","label":"title","key":"title"}}]}
 ```

 ### Bulk Create Tasks
**Method:** POST  
**Endpoint:**  http://localhost:3000/api/tasks/bulk
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/bulk' \
--header 'Content-Type: application/json' \
--data '{
  "tasks": [
    {
      "title": "Study JavaScript",
      "isCompleted": false,
      "priority": "low"
    },
    {
      "title": "Learn JWT Authentication",
      "isCompleted": false,
      "priority": "medium"
    },
    {
      "title": "Testing JWT Using Postman ",
      "isCompleted": true,
      "priority": "high"
    }
  ]
}'
 ```
**Status:** 🟢 `201 CREATED – PASSED`
**Request Body:**
``` json
{"message":"Bulk task creation successful","tasksCreated":3,"totalRequested":3}
```

### Get User Analytics
**Method:** GET  
**Endpoint:**  
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/analytics/users/1'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"taskStats":[
  {"_count":{"id":5},"isCompleted":false},{"_count":{"id":2},"isCompleted":true}],
  "recentTasks":[
    {"id":14,"title":"Study JavaScript","isCompleted":false,"priority":"low","createdAt":"2026-11-23T18:47:34.683Z","userId":1,"User":{"name":"John"}},
    {"id":16,"title":"Testing JWT Using Postman","isCompleted":true,"priority":"high","createdAt":"2026-11-23T18:47:34.683Z","userId":1,"User":{"name":"John"}},
    {"id":15,"title":"Learn JWT Authentication","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T18:47:34.683Z","userId":1,"User":{"name":"John"}},
    {"id":7,"title":"Finish Assignment 8","isCompleted":true,"priority":"medium","createdAt":"2026-11-23T03:54:23.722Z","userId":1,"User":{"name":"John"}},
    {"id":1,"title":"Complete your profile","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T02:42:45.277Z","userId":1,"User":{"name":"John"}},
    {"id":3,"title":"Explore the app","isCompleted":false,"priority":"low","createdAt":"2026-11-23T02:42:45.277Z","userId":1,"User":{"name":"John"}},
    {"id":2,"title":"Add your first task","isCompleted":false,"priority":"high","createdAt":"2026-11-23T02:42:45.277Z","userId":1,"User":{"name":"John"}}],
    "weeklyProgress":[
      {"_count":{"id":3},"createdAt":"2026-11-23T02:42:45.277Z"},
      {"_count":{"id":1},"createdAt":"2026-11-23T03:54:23.722Z"},
      {"_count":{"id":3},"createdAt":"2026-11-23T18:47:34.683Z"}]}
 ```

### Delete a Task
**Method:** DELETE  
**Endpoint:**  http://localhost:3000/api/tasks/7
**Curl Command:**
``` bash
curl --location --request DELETE 'http://localhost:3000/api/tasks/7'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"id":7,"title":"Finish Assignment 8","isCompleted":true}
 ```

### Get a Delete Task
**Method:** GET  
**Endpoint:**  http://localhost:3000/api/tasks/7
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/tasks/7'
 ```
**Status:** 🔴 `404 Not Found` 
**Request Body:**
``` json
{"message":"No matching task exists."}
 ```

### Get Users With Statistics
**Method:** GET  
**Endpoint:**  http://localhost:3000/api/analytics/users
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/analytics/users' 
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"users":[
  {"id":8,"name":"Manuel","email":"manuel@sample.com","createdAt":"2026-11-23T05:30:03.311Z","_count":{"Task":3},"Task":[{"id":11},{"id":12},{"id":13}]},
  {"id":4,"name":"Jim","email":"jim@sample.com","createdAt":"2026-11-23T05:30:00.400Z","_count":{"Task":3},"Task":[{"id":8},{"id":9},{"id":10}]},
  {"id":2,"name":"Jane Doe","email":"jane@example.com","createdAt":"2026-11-23T03:11:30.178Z","_count":{"Task":3},"Task":[{"id":4},{"id":5},{"id":6}]},
  {"id":1,"name":"John","email":"john@example.com","createdAt":"2026-11-23T02:42:45.257Z","_count":{"Task":6},"Task":[{"id":1},{"id":2},{"id":3},{"id":14},{"id":15}]}],
  "pagination":{"page":1,"limit":10,"total":4,"pages":1,"hasNext":false,"hasPrev":false}}
 ```

### Search Tasks
**Method:** GET  
**Endpoint:** http://localhost:3000/api/analytics/tasks/search?q=JWT 
**Curl Command:**
``` bash
curl --location 'http://localhost:3000/api/analytics/tasks/search?q=JWT'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"results":[
  {"id":15,"title":"Learn JWT Authentication","isCompleted":false,"priority":"medium","createdAt":"2026-11-23T18:47:34.683Z","userId":1,"user_name":"John"},
  {"id":16,"title":"Testing JWT Using Postman","isCompleted":true,"priority":"high","createdAt":"2026-11-23T18:47:34.683Z","userId":1,"user_name":"John"}],
  "query":"JWT","count":2}
 ```

### Logoff User 1
**Method:** POST  
**Endpoint:**  
**Curl Command:**
``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'
 ```
**Status:** 🟢 `200 OK`  
**Request Body:**
``` json
{"message":"User logged off successfully"}
 ```