import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserSchema } from '../models/userModel';

const User = mongoose.model('User', UserSchema);

export const loginRequired = (req, res, next) => {
    console.log("test", req.user);
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
};

export const register = (req, res) => {
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => {
        if (err) return res.status(400).send({ message: err });
        user.hashPassword = undefined;
        return res.json(user);
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({
        email: email
    },
    (err, user) => {
        if (err) throw err;
        if (!user || !user.comparePassword(password, user.hashPassword)) {
            res.status(401).json({ message: 'No user found for this email and password combination' });
        }
        res.status(200).json({token: jwt.sign({
            email: user.email,
            username: user.username,
            _id: user._id}, 'secretword'
            )})
    });
};