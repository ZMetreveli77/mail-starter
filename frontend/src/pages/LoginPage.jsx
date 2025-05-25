import { Form, Formik, ErrorMessage } from "formik";
import { Link } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { string, object } from "yup";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthContext";

const loginSchema = object({
  email: string()
    .trim()
    .required()
    .matches(/^\S+@\S+\.\S+$/, "Please enter a valid email"),
  password: string().trim().min(8).required(),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const initialValues = {
    email: "",
    password: "",
  };
  const [err, setErr] = useState("");

  const loginUser = async (loginValues, { setSubmitting }) => {
   try {
      setErr("");
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginValues),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const user = await res.json();
      setUser(user);
      navigate("/c/inbox");
    } catch (error) {
      setErr(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto my-4 flex flex-col gap-4">
      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={loginUser}>
        {(formikProps) => {
          return (
            <Form className="flex flex-col gap-4">
              {err && (
                <div className=" text-sm bg-red-100 p-3 rounded-sm text-red-600">
                  {err}
                </div>
              )}
              <div>
                <Label htmlFor="email" className="mb-4 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  {...formikProps.getFieldProps("email")}
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-4 block">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...formikProps.getFieldProps("password")}
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div className="flex items-center gap-4 justify-between">
                <span>
                  Don't have an account?{" "}
                  <Link className="text-blue-500" to="/register">
                    Register
                  </Link>
                </span>
                <Button
                  type="submit"
                  className="self-end"
                  disabled={formikProps.isSubmitting}
                >
                  Login
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
