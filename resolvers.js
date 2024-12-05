import { getData, getUsers, getDataMap } from './database.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';  

let data = getData();
let users = getUsers();


const writeToFile = () => {
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); 
};

const resolvers = {
    Query: {
        getAllData: (parent, args, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return data;  
        },

        getDatabyId: (root, args, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }
            return data.find(p => p.id === args.id);
        },

        getUserData: (parent, args) => {
            const dataMap = getDataMap();
            const userId = dataMap[args.username];
            if (!userId) return [];  
            return data.filter(person => userId.includes(person.id));
        },

        getUsers: () => users,
    },

    User: {
        userOwnData: (parent) => {
            const dataMap = getDataMap();
            const userIds = dataMap[parent.username];
            if (!userIds) return [];  
            return data.filter(person => userIds.includes(person.id));
        },
    },

    Mutation: {
        addData: (parent, args, context) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            if (data.find(b => b.id === args.id)) {
                throw new Error('Record already exists');  
            } else {
                const newData = { ...args };  
                data = data.concat(newData);  

                try {
                    writeToFile();  
                } catch (error) {
                    throw new Error('Failed to save data');  
                }

                return newData;  
            }
        },

        login: (parent, { username, password }) => {
            const user = users.find(user => user.username === username &&
                user.password === password);
            if (!user) throw new Error('Invalid credentials');  

            const token = jwt.sign({ username: username }, 'my_secret_key', { expiresIn: '1d' });
            const bearer_token = 'Bearer ' + token;  
            user.token = token;  
            return { "token": bearer_token, username };  
        }
    }
};

export default resolvers;
