import { string, ref, object } from "yup"

const baseAuthSchema = object({
  email: string()
    .required()
    .min(5)
    .max(45)
    .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email"),
  password: string().trim().min(8).required()
})

export const loginSchema = baseAuthSchema
export const registerSchema = baseAuthSchema.shape({
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords do not match")
    .required()
})

export const emailComposeSchema = object({
  subject: string().trim().min(3).required(),
  body: string().trim().min(3).required(),
  recipients: string()
    .trim()
    .required()
    .test("are-valid-emails", "One or more emails are invalid", (value) => {
      const emails = value.split(",")
      const emailRegex = /^\S+@\S+\.\S+$/
      return emails.every((email) => emailRegex.test(email.trim()))
    })
})


export default {
  loginSchema,
  registerSchema,
  emailComposeSchema
}