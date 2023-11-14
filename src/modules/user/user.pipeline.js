export const specialistLookup = {
    from: 'medicalspecialties',
    localField: '_id',
    foreignField: 'members',
    as: 'specialist',
    pipeline: [
        {
            $project: {
                members: 0,
            },
        },
    ],
};
