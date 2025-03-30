import mongoose, { Schema } from "mongoose";
import { EMAIL_REGEXP } from "../constants/regex";
import { getTimeZones } from "@vvo/tzdb";
import moment from "moment";

const UserSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return EMAIL_REGEXP.test(value);
      },
      message: (props: any) => `${props.value} is not a valid email address!`,
    },
  },
  birthday: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return moment(value, "YYYY-MM-DD", true).isValid();
      },
      message: (props: any) =>
        `${props.value} is not a valid date! Use the format YYYY-MM-DD.`,
    },
  },
  timezone: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        const timezones = getTimeZones();
        return timezones.some((timezone) => timezone.name === value);
      },
      message: (props: any) => `${props.value} is not a valid IANA timezone!`,
    },
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
