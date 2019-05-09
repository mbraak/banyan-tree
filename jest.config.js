module.exports = {
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            tsConfig: 'packages/tsconfig-base.json',
        },
    },
};
