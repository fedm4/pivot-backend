import bcrypt from 'bcrypt';

const hashPassword = async(password) => {
    // Generate salt and hash password
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }catch(err) {
        throw err;
    }
};

export default {
    hashPassword
};