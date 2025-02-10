import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"],
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        enum: ["USD", "EUR", "GBP"],
        default: "USD",
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["sports", "entertainment", "news", "lifestyle", "technology", "finance", "politics", "other"],
        required: true,
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: 
            (value) => value <= new Date(),    
            message: "Start date must be in the past",   
        },
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: 
            function (value) {
              return  value > this.startDate;
            },   
            message: "Renewal date must be after the start date",   
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, { timestamps: true });


// Auto-calculate the renewal date if missing
subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);4
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }


// Auto-update the status if the renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }
    next();
});


const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;