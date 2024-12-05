const typeDefs = `
"Authorization record"
type User {
    username: String!
    password: String!
    token: String
    userOwnData: [Data!]!
}

type AuthPayload {
    "Bearer token fo authorizated user"
    token: String!
    "User who own the token"
    username: String!
}

"Returned data structure"
type Data {
    "Data id, must be unique"
    id: ID!
    "Users firstname"
    Firstname: String!
    "Users surname"
    Surname: String!
}

type Query {
    "API call for returning all data"
    getAllData: [Data!]!
    "API call which return data besd on it id"
    getDatabyId(id: ID!): Data!
    "Returns data records based on ?"
    getUserData(username: String!): [Data!]
    getUsers: [User!]!
}

type Mutation {
    addData(
        id: ID!
        Firstname: String!
        Surname: String!
    ): Data
    login(username: String!, password: String!): AuthPayload
}
`

export default typeDefs