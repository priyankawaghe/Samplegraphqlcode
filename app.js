
const { ApolloServer, gql } = require('apollo-server');

//typeDefs
const typeDefs = gql`

  type Book {
    title: String
    author: String
}
  type Query {
    books: [Book]
}
  type Phone {
    areaCode: Int
    number: Int
}
type Query {
    phone : [Phone]
}
input InputUserRegisterData{
  email: String
  areaCode: Int
  password: String
  phone: Int
}
type UserRegisterResponse{
  status: String
  message: String
}
type Query {
  Status :[UserRegisterResponse]
}
enum UserRegisterStatus {
  SUCCESS
  FAILURE
}
type Mutation {
 
  register(userRegisterData: InputUserRegisterData): UserRegisterResponse
    responses(status: UserRegisterStatus): UserRegisterResponse
 
}
`;



// Dummy Database
let dummyDb = [
  {
    id: 1, email: "p.waghe90@gmail.com", areaCode: "7867", password: "7686875", phone: "987654321", status: "SUCCESS"
    //  id:2, email:"abc@gmail.com",areaCode:"786",password:"75",phone:"98765432980", status:"FAILURE", message:"Failure"
  }
]

// Mutation fields
const root = {
  UserRegisterStatus: ({ id }) => {
    if (!dummyDb[id]) {
      throw new Error('no message exists with id ' + id);
    }
    return new Status(id, dummyDb[id]);
  },
  register: ({ userRegisterData }) =>
  (
    dummyDb[dummyDb.length] = { id: dummyDb.length, userRegisterData }
  ),
  responses: ({ status }) => {
    console.log('status', status);

    if (status) {
      return dummyDb.filter((userRegisterData) =>
        userRegisterData.status === status)
    }
    return dummyDb;
  }

}
module.exports = root;


//Static Data
const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
  },
];
const phone = [
  {
    areaCode: 234,
    number: 988676657
  }
];
const Status = [
  {
    status: "Success",
    message: "Succesfully Registered"
  }
]

//resolvers
const resolvers = {
  Query: {
    books: () => books,
    phone: () => phone,
    Status: () => Status

  },
  Mutation: {
    register: () => root.register,
    responses: () => root.responses


  },
};



//passing typeDefs and resolvers as a parameters
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});