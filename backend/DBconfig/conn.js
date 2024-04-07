import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`DB connect Successfully `)

    } catch (error) {
        console.log(`BD ERROR ${error}`)
    }
}
export default connectDB;