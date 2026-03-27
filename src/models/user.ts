import { Schema, model } from 'mongoose';




export interface IUser {
    username: string;
    email: string; 
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        x?: string;
        youtube?: string;
    };

}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        masLength: [30, 'Username cannot exceed 30 characters'],
        unique: [true, 'Username already exists']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxLength: [100, 'Email cannot exceed 100 characters'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long'],
        select: false, // Exclude password from query results by default
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['user', 'admin'],
            message: 'Role must be either user or admin'
        },
        default: 'user'
    },
    firstName: {
        type: String,
        maxLength: [50, 'First name cannot exceed 50 characters'],

    },
    lastName: {
        type: String,
        maxLength: [50, 'Last name cannot exceed 50 characters'],
    },
    socialLinks: {
        website: {
            type: String,
            maxLength: [100, 'Website URL cannot exceed 100 characters'],
        },
        facebook: {
            type: String,
            maxLength: [100, 'facebook URL cannot exceed 100 characters'],
        },
        instagram: {
            type: String,
            maxLength: [100, 'instagram URL cannot exceed 100 characters'],
        },
        linkedin: {
            type: String,
            maxLength: [100, 'linkedin URL cannot exceed 100 characters'],
        },
        x: {
            type: String,
            maxLength: [100, 'X URL cannot exceed 100 characters'],
        },
        youtube: {
            type: String,
            maxLength: [100, 'youtube URL cannot exceed 100 characters'],
        },
        
    },
}, {
    timestamps: true,   
});


export default model<IUser>('User', userSchema);