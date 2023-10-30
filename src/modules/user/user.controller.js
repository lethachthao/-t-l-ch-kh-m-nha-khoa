import { userModel } from '../../models/user.model';

export const getUsers = async (req, res, next) => {
    const result = await userModel.find({});
    res.status(200).json({ data: result });
};

export const createUser = async (req, res, next) => {
    const result = await userModel.create(req.body);

    res.status(200).json({ data: result });
};
