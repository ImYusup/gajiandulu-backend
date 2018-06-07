const books = `
  type Query { books: [Book], employees: [Employee], users: [User] }
  type Book { title: String, author: String }
  type Employee { title: String, author: String }
  type User { title: String, author: String }
`;

module.exports = books;
