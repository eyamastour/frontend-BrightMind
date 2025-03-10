export interface User {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    role: string;
    isVerified: boolean;
    language: string;
    company: string;
    installationPermissions?: string[]; // Array of installation IDs the user has access to
}
