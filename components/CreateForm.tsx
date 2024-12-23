/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Collapse } from "@mui/material";
import { FC, JSX, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Alert, { AlertProps } from "@/components/Alert";
import InputField from "@/components/generic/InputField"; // Adapter le chemin selon la structure de ton projet

interface CreateFormProps {
  categoryId: number;
  descriptionTemplate: any;
}

const CreateForm: FC<CreateFormProps> = ({ categoryId, descriptionTemplate }): JSX.Element => {
  const [formFields, setFormFields] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<AlertProps>();
  const [feedbackMessageOpen, setFeedbackMessageOpen] = useState(false);
  const { control, handleSubmit, reset, clearErrors, register } = useForm();

  useEffect(() => {
    if (descriptionTemplate) {
      const fields = Object.keys(descriptionTemplate);
      setFormFields(fields);
      const defaultValues: Record<string, any> = {};
      fields.forEach((field) => {
        defaultValues[field] = descriptionTemplate[field] === "text" ? "" : 0;
      });
      reset(defaultValues);
    }
  }, [descriptionTemplate, reset]);

  useEffect(() => {
    if (feedbackMessage) {
      setFeedbackMessageOpen(true);
      const timer = setTimeout(() => {
        setFeedbackMessageOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log("data", data);
    const payload = {
      ...data,
    };
    await fetch("/api/items/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.ok) {
        clearErrors();
        reset();
        setFeedbackMessage({ severity: "success", message: "New item successfully created" });
      } else {
        setFeedbackMessage({ severity: "error", message: "An error occurred while creating the item" });
      }
    });
  };

  if (!descriptionTemplate) return <></>;

  return (
    <>
      {feedbackMessage && (
        <Collapse in={feedbackMessageOpen}>
          <Alert severity={feedbackMessage.severity} message={feedbackMessage.message} />
        </Collapse>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {formFields.map((field) => (
          <>
            <input type="hidden" value={categoryId} {...register("categoryId")} />
            <div key={field}>
              <InputField name={field} label={field} control={control} size="small" />
            </div>
          </>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateForm;
