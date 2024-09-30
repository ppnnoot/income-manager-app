const bcrypt = require('bcrypt');

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    return hashedPassword; 
}

export const checkPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compareSync(password, hashedPassword);
    return isMatch;
}