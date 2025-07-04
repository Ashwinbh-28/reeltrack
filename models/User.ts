import mongoose, {Schema,model, models} from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
    email: string;
    password: string;
    _id? : mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date; 
}
// Making custom methods for the user model using <IUser> interface
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
)

// Creating hooks for the DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        await bcrypt.hash(this.password, 10)
    }
    next();    
})

const User = models?.User || model<IUser>("User",userSchema);

export default User;