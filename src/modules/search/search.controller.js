import { userModel } from '../../models/user.model';
import { catchAsync } from '../../utils/catch-async';

export const getSearch = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    // const { type } = req.queryPolluted; // ['specialist', 'doctor']

    const result = await userModel
        .aggregate()
        .match({
            $or: [
                {
                    name: {
                        $regex: '.*' + q + '.*',
                        $options: 'i',
                    },
                    accountType: 'doctor',
                },
            ],
        })
        .unionWith({
            coll: 'medicalspecialties',
            pipeline: [
                {
                    $match: {
                        $or: [
                            {
                                name: {
                                    $regex: '.*' + q + '.*',
                                    $options: 'i',
                                },
                            },
                        ],
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { searchType: 'specialist' },
                                '$$ROOT',
                            ],
                        },
                    },
                },
            ],
        })
        .project({
            password: 0,
            accountType: 0,
            role: 0,
            createdAt: 0,
            updatedAt: 0,
        })
        .replaceRoot({
            $mergeObjects: [{ searchType: 'doctor' }, '$$ROOT'],
        });

    res.status(200).json({ data: result });
});
