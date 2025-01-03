export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,

    database: {
        mongodb_main: { url: process.env.MONGODBURL || 'mongodb://localhost:27017', name: 'production' },
        mongodb_bin: { url: process.env.MONGODBURL_BIN || 'mongodb://localhost:27017', name: 'BIN' },
    },
    jwtConstant: {
        secret: {
            key: process.env.JWT_SECRET_KEY || 'your-secret-key',
            expiresIn: process.env.JWT_SECRET_EXPIRATION || '1h',
        },
        public: {
            key: process.env.JWT_PUBLIC_KEY || 'your-secret-key',
            expiresIn: process.env.JWT_PUBLIC_KEY_EXPIRATION || '1h',
        },
    },
    oauth2: {
        provider: {
            google: {
                clientID: process.env.GOOGLE_CLIENT_ID || 'google-id',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-secret',
                callbackURL: process.env.CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
            },
        },
    },

    client: {
        frontend: {
            url: process.env.FRONTEND_URL || 'http://localhost:3000',
        },
    },
    mailer: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.HOST_EMAIL_USER || 'maddison53@ethereal.email',
            pass: process.env.HOST_EMAIL_PASS || 'jn7jnAPss4f63QBp6D',
        },
    },

    getApiKeys: () => {
        const list_of_keys: string[] = [];
        let i = 1;
        while (1) {
            if (!process.env[`BACKEND_API_KEY_${i}`]) {
                break;
            }
            list_of_keys.push(process.env[`BACKEND_API_KEY_${i}`]);
            i++;
        }

        return list_of_keys;
    },
});
