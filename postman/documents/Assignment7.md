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
  "name": "John Smith",
  "email": "john@example.com",
  "password": "Password123!"
}'

 ```

**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**

``` json
{"user":{"id":1,"email":"john@example.com","name":"John Smith","createdAt":"2026-11-16T03:12:39.351Z"},
"welcomeTasks":[{"id":1,"title":"Complete your profile","isCompleted":false,"userId":1,"priority":"medium"},
{"id":2,"title":"Add your first task","isCompleted":false,"userId":1,"priority":"high"},
{"id":3,"title":"Explore the app","isCompleted":false,"userId":1,"priority":"low"}],"transactionStatus":"success"}

 ```

### Test duplicate registration

_Repeat User 1 registration using the same email._  
**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/register](http://localhost:3000/api/users/register)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "Password123!"
}'

 ```

**Status:** 🔴 `400 BAD REQUEST`  
**Request Body:**

``` json
{"message":"Email already registered"}

 ```

### Logon as User 1

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logon](http://localhost:3000/api/users/logon])  
**Curl Command:**

``` bash
curl --location --request GET 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "john@example.com",
  "password": "Password123!"
}'

 ```

**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**

``` json
{"name":"John Smith","email":"john@example.com"}

 ```

### Show User 1

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/1](http://localhost:3000/api/users/1)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/users/1'

 ```

**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**

``` json
{"id":1,"name":"John Smith","email":"john@example.com","createdAt":"2026-11-16T03:12:39.351Z"}

 ```

### Create a task for User 1

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks])  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/tasks' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Finish Assignment 7",
  "isCompleted": false
}'

 ```

**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**

``` json
{"id":4,"title":"Finish Assignment 7","isCompleted":false,"priority":"medium"}

 ```

### Get All Tasks

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks])  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/tasks'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"tasks":[{"id":4,"title":"Finish Assignment 7","isCompleted":false,"priority":"medium","createdAt":"2026-11-16T03:56:15.034Z","User":{"name":"John Smith","email":"john@example.com"}},
{"id":2,"title":"Add your first task","isCompleted":false,"priority":"high","createdAt":"2026-11-16T03:12:39.388Z","User":{"name":"John Smith","email":"john@example.com"}},
{"id":3,"title":"Explore the app","isCompleted":false,"priority":"low","createdAt":"2026-11-16T03:12:39.388Z","User":{"name":"John Smith","email":"john@example.com"}},
{"id":1,"title":"Complete your profile","isCompleted":false,"priority":"medium","createdAt":"2026-11-16T03:12:39.388Z","User":{"name":"John Smith","email":"john@example.com"}}],
"pagination":{"page":1,"limit":10,"total":4,"pages":1,"hasNext":false,"hasPrev":false}}

 ```

### Get One Task

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks/4](http://localhost:3000/api/tasks/4)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/tasks/4' \
--data ''

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"id":4,"title":"Finish Assignment 7","isCompleted":false,"priority":"medium"}

 ```

### Update a Task

**Method:** PATCH  
**Endpoint:** [http://localhost:3000/api/tasks/4](http://localhost:3000/api/tasks/4)  
**Curl Command:**

``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/4' \
--header 'Content-Type: application/json' \
--data '{
  "isCompleted": true
}'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"title":"Finish Assignment 7","isCompleted":true,"id":4,"priority":"medium"}

 ```

### Delete a Task

**Method:** DELETE  
**Endpoint:** [http://localhost:3000/api/tasks/4](http://localhost:3000/api/tasks/4)  
**Curl Command:**

``` bash
curl --location --request DELETE 'http://localhost:3000/api/tasks/4'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"id":4,"title":"Finish Assignment 7","isCompleted":true}

 ```

### Bulk Create Tasks

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/tasks/bulk](http://localhost:3000/api/tasks/bulk)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/tasks/bulk' \
--header 'Content-Type: application/json' \
--data '{
  "tasks": [
    {
      "title": "Study JavaScript",
      "isCompleted": false,
      "priority": "high"
    },
    {
      "title": "Practice Prisma",
      "isCompleted": false,
      "priority": "medium"
    },
    {
      "title": "Review Express",
      "isCompleted": true,
      "priority": "low"
    }
  ]
}'

 ```

**Status:** 🟢 `201 CREATED – PASSED`  
**Request Body:**

``` json
{"message":"Bulk task creation successful","tasksCreated":3,"totalRequested":3}

 ```

### Get Users With Statistics

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/analytics/users](http://localhost:3000/api/analytics/users)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/analytics/users'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"users":[{"id":1,"name":"John Smith","email":"john@example.com","createdAt":"2026-11-16T03:12:39.351Z","_count":{"Task":6},
"Task":[{"id":1},{"id":2},{"id":3},{"id":5},{"id":6}]}],"pagination":{"page":1,"limit":10,"total":1,"pages":1,"hasNext":false,"hasPrev":false}}

 ```

### Get User Analytics

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/analytics/users/1](http://localhost:3000/api/analytics/users)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/analytics/users/1'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"taskStats":[{"_count":{"id":5},"isCompleted":false},{"_count":{"id":1},"isCompleted":true}],"recentTasks":[{"id":5,"title":"Study JavaScript","isCompleted":false,
"priority":"high","createdAt":"2026-11-16T04:23:55.262Z","userId":1,"User":{"name":"John Smith"}},{"id":6,"title":"Practice Prisma","isCompleted":false,
"priority":"medium","createdAt":"2026-11-16T04:23:55.262Z","userId":1,"User":{"name":"John Smith"}},{"id":7,"title":"Review Express","isCompleted":true,
"priority":"low","createdAt":"2026-11-16T04:23:55.262Z","userId":1,"User":{"name":"John Smith"}},{"id":2,"title":"Add your first task","isCompleted":false,
"priority":"high","createdAt":"2026-11-16T03:12:39.388Z","userId":1,"User":{"name":"John Smith"}},{"id":3,"title":"Explore the app","isCompleted":false,
"priority":"low","createdAt":"2026-11-16T03:12:39.388Z","userId":1,"User":{"name":"John Smith"}},{"id":1,"title":"Complete your profile","isCompleted":false,
"priority":"medium","createdAt":"2026-11-16T03:12:39.388Z","userId":1,"User":{"name":"John Smith"}}],
"weeklyProgress":[{"_count":{"id":3},"createdAt":"2026-11-16T03:12:39.388Z"},{"_count":{"id":3},"createdAt":"2026-11-16T04:23:55.262Z"}]}

 ```

### Search Tasks

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/analytics/tasks/search?q=Study](http://localhost:3000/api/analytics/tasks/search?q=Study)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/analytics/tasks/search?q=Study'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"results":[{"id":5,"title":"Study JavaScript","isCompleted":false,"priority":"high","createdAt":"2026-11-16T04:23:55.262Z","userId":1,"user_name":"John Smith"}],"query":"Study","count":1}

 ```

### Logoff User 1

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logoff](http://localhost:3000/api/users/logoff])  
**Curl Command:**

``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'

 ```

**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**

``` json
{"message":"User logged off successfully"}`

 ```

### Register User 2

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/register](http://localhost:3000/api/users/register)

**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/users/register' \
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
{"user":{"id":3,"email":"jane@example.com","name":"Jane Doe","createdAt":"2026-11-16T04:56:53.741Z"},
"welcomeTasks":[{"id":8,"title":"Complete your profile","isCompleted":false,"userId":3,"priority":"medium"},
{"id":9,"title":"Add your first task","isCompleted":false,"userId":3,"priority":"high"},
{"id":10,"title":"Explore the app","isCompleted":false,"userId":3,"priority":"low"}],"transactionStatus":"success"}

 ```

### Show All Users

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/analytics/users](http://localhost:3000/api/analytics/users)

[http://localhost:3000/api/analytics/users?page=1&amp;limit=10](http://localhost:3000/api/analytics/users?page=1&limit=10)  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/analytics/users'
curl --location 'http://localhost:3000/api/analytics/users?page=1&limit=10'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"users":[{"id":3,"name":"Jane Doe","email":"jane@example.com","createdAt":"2026-11-16T04:56:53.741Z","_count":{"Task":3},"Task":[{"id":8},{"id":9},{"id":10}]},
{"id":1,"name":"John Smith","email":"john@example.com","createdAt":"2026-11-16T03:12:39.351Z","_count":{"Task":6},"Task":[{"id":1},{"id":2},{"id":3},{"id":5},{"id":6}]}],
"pagination":{"page":1,"limit":10,"total":2,"pages":1,"hasNext":false,"hasPrev":false}}

 ```

### Logon as User 2

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logon](http://localhost:3000/api/users/logon])  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/users/logon' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "jane@example.com",
  "password": "Password123!"
}'

 ```

**Status:** 🟢 `200 OK – PASSED`  
**Request Body:**

``` json
{"name":"Jane Doe","email":"jane@example.com"}

 ```

### User 2 List Tasks

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks](http://localhost:3000/api/tasks])  
**Curl Command:**

``` bash
curl --location 'http://localhost:3000/api/tasks'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"tasks":[{"id":8,"title":"Complete your profile","isCompleted":false,"priority":"medium","createdAt":"2026-11-16T04:56:53.745Z","User":{"name":"Jane Doe","email":"jane@example.com"}},
{"id":9,"title":"Add your first task","isCompleted":false,"priority":"high","createdAt":"2026-11-16T04:56:53.745Z","User":{"name":"Jane Doe","email":"jane@example.com"}},
{"id":10,"title":"Explore the app","isCompleted":false,"priority":"low","createdAt":"2026-11-16T04:56:53.745Z","User":{"name":"Jane Doe","email":"jane@example.com"}}],
"pagination":{"page":1,"limit":10,"total":3,"pages":1,"hasNext":false,"hasPrev":false}}

 ```

### User 2 tries to Get User 1's task

**Method:** GET  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1])  
**Curl Command:**

``` bash
curl --location --request GET 'http://localhost:3000/api/tasks/1' \
--header 'Content-Type: text/plain' \
--data '{
  "title": "Trying to read John'\''s task"
}'

 ```

**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**

``` json
{"message":"No matching task exists."}

 ```

### User 2 tries to Update User 1's task

**Method:** PATCH  
**Endpoint:** [http://localhost:3000/api/tasks/1](http://localhost:3000/api/tasks/1])  
**Curl Command:**

``` bash
curl --location --request PATCH 'http://localhost:3000/api/tasks/1' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Trying to change John'\''s task"
}'

 ```

**Status:** 🔴 `404 NOT FOUND`  
**Request Body:**

``` json
{"message":"The task was not found."}

 ```

### Logoff User 2

**Method:** POST  
**Endpoint:** [http://localhost:3000/api/users/logoff](http://localhost:3000/api/users/logoff])  
**Curl Command:**

``` bash
curl --location --request POST 'http://localhost:3000/api/users/logoff'

 ```

**Status:** 🟢 `200 OK`  
**Request Body:**

``` json
{"message":"User logged off successfully"}

 ```