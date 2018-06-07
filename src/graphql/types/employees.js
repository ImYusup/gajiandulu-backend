const employees = `
  type Query { 
    employees: [Employee] }
  type Employee { 
    user_id: Int, 
    roles: Int,
    salary: Int
   }
`;

module.exports = employees;

//books: [Book],
//type Book { title: String, author: String }
