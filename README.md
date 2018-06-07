# gajiandulu-backend
# Overview

Employees can be managed by manager or admin. That means new employee can be added, and existing employee can be updated or deleted

## GraphQL

### Employees List

This page will show admins or manager in a list of employees, along with some information like name or email

#### `/admins`

#### Query 
```json
{
  Employees {
     employee {
       id,
       user: {
         id,
         fullname,
         email,
         birthday,
         phone,
         currency
       },
       roles: {
         role
       }
       salary: 
     }
  }
}
```

#### JSON Result
```
{
  "data": {
    "employees": [
      "id": "1",
      "user":
        {
          "id": "1",
          "name": "Steve Rogers",
          "email": "captain@america.com",
          "birthday": "02/02/1980",
          "currency": "idr"
        },
      "roles": {
         "role": "manajer"
      },
      "salary": 12000000000
    ]
  }
}
```

#### Wireframes

![image](/uploads/67ee18bd27e08ce9ada583772cffe0b7/image.png)

## Add New Employee

The manager can add employee from users table.

### `Mutation admins`

#### Query 
```json
mutation createEmployees() {
  employees: {
    compnanies: {
      id: 1
    },
    users: {
      id: 2
    },
    roles: {
      id: 3
    },
    salary: 40000000
  }
}

```


#### JSON Result
```json
{
  "data": {
    "employees": [
      "id": "1",
      "user":
        {
          "id": "2",
          "name": "Tony Start",
          "email": "iron@man.com",
          "birthday": "03/03/1980",
          "currency": "idr"
        },
      "roles": {
         "role": "karyawan"
      },
      "salary": 12000000000
    ]
  }
}
```

#### Wireframes

![image](/uploads/4bc3793ccc9028191e9629043f919da1/image.png)


## Delete Employees

### `Mutation /admins/`

#### Query
```
mutation deleteEmployees($id: EmployeeId!){
  employees(id: $id)
}
```

#### JSON Result
```
{
  "data": {
  }
}
```

#### Wireframes

![image](/uploads/67ee18bd27e08ce9ada583772cffe0b7/image.png)
