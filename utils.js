import jwt from 'jsonwebtoken';
import {getUsers} from './database.js'

//Middleware to extract and verify token
const verifyToken = (bearer_token) => {
    try {
        const token = bearer_token.replace('Bearer ', '')
        if(token) {
            const decodedToken = jwt.verify(token, 'my_secret_key');
            const now = Date.now()/1000;
            const isValid = (decodedToken.exp-now) >= 0 ? true: false;
            if( isValid ) {
                const users = getUsers();
                if(users.find(a => (a.username === decodedToken.username)&&(a.token === token))){
                    return decodedToken.username;
                }
            } 
        }
        return null;
    } catch (err) {
        console.error('Bearer token verification error', err);
        return null;
    }
}

export {
    verifyToken
}