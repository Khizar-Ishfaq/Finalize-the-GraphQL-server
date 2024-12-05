import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import typeDefs from './typedefs.js'
import resolvers from './resolvers.js'
import {verifyToken} from './utils.js'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
        return {
            error: error.message
        }
    }
});

const {url} = await startStandaloneServer(server, {
    context: ({req}) => {
        const token = req.headers.authorization || '';
        const user = verifyToken(token);
        return { user }; 
    },
    listen: {port: 4000}
});

console.log(`Server ready at: ${url}`);