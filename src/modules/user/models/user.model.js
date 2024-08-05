import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 500,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 500,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // select: false,
    },
    recoveryEmail: {
        type: String,
        default: null
    },
    DOB: {
        type: Date,
        required: true
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['User', 'Company_HR','Manger'],
        default: 'User'
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
        required: true,
        trim: true,
    },
    email_verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    otp: {
        type: String,
        length: 6
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLoggedOut: {
        type: Boolean,
        default: false
    },
    profilePicture :{
        type :String,
    },
    passwordChangedAt: { type: Date, },
    userName: { type: String },
    age: { type: Number }
},
    { timestamps: true }
)

userSchema.pre('save', function (next) {
    this.userName = `${this.firstName} ${this.lastName}`;
    
    const today = new Date();
    const birthDate = new Date(this.DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    this.age = age;

    next()
})

userSchema.pre(/^find/, function (next) {
    this.userName = `${this.firstName} ${this.lastName}`
    const today = new Date();
        const birthDate = new Date(this.DOB);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
    next()
})



export const userModel = mongoose.model('user', userSchema)