import { Form, Formik, ErrorMessage } from "formik";
import { useLocation } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { string, object } from "yup";

const emailComposeSchema = object({
  subject: string().trim().min(3).required(),
  body: string().trim().min(3).required(),
  recipients: string()
    .trim()
    .required()
    .test("are-valid-emails", "One or more emails are invalid", (value) => {
      const emails = value.split(",");
      const emailRegex = /^\S+@\S+\.\S+$/;
      return emails.every((email) => emailRegex.test(email.trim()));
    }),
});

export const ComposeEmailPage = () => {
  const location = useLocation();

  // recipients field MUST be a comma separated email STRING
  // for example: demo@email.com,emmet@email.com
  // (we cal also have a single email without any commas)
  const initialValues = location.state || {
    recipients: "",
    subject: "",
    body: "",
  };

  const sendEmail = async (emailValues) => {
     try {
    const res = await fetch("/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(emailValues),
    });

    if (!res.ok) throw new Error("Failed to send email");

    resetForm();
    alert("Email sent!");
  } catch (err) {
    console.error("Email sending failed", err);
    alert("Failed to send email.");
  }
  };

  return (
    <div>
      <Formik   initialValues={initialValues}  validationSchema={emailComposeSchema} onSubmit={sendEmail}>
        {(formik) => {
          return (
            <Form
              autoComplete="off"
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <div>
                <Label className="mb-4 inline-block" htmlFor="recipients">
                  Recipients
                </Label>
                <Input
                  id="recipients"
                  {...formik.getFieldProps("recipients")}
                />
                <ErrorMessage
                  name="recipients"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label className="mb-4 inline-block" htmlFor="subject">
                  Subject
                </Label>
                <Input id="subject" {...formik.getFieldProps("subject")} />
                <ErrorMessage
                  name="subject"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label className="mb-4 inline-block" htmlFor="subject">
                  Body
                </Label>
                <Textarea
                  ref={textareaRef}
                  rows="15"
                  id="body"
                  {...formik.getFieldProps("body")}
                />
                <ErrorMessage
                  name="body"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <Button className="self-end">Send</Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
