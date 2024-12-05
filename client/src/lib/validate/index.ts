import z from "zod"

const emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
export const SignUpValidation = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    email: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .email("This is not a valid email.")
        .superRefine((data, ctx) => {
            if (!emailRegex.test(data)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_string,
                    message: "Invalid email address",
                    validation: "email",
                });
            }
        })
})
export const SignInValidation = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    email: z.string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .email("This is not a valid email.")
        .superRefine((data, ctx) => {
            if (!emailRegex.test(data)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_string,
                    message: "Invalid email address",
                    validation: "email",
                });
            }
        })
})

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const UserPostSchema = z.object({
    image: z
        .any()
        .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        ),
    caption: z.string().max(2200)
})