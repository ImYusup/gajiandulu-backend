const books = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

module.exports = books;
