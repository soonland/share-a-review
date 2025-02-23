/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Collapse } from "@mui/material";
import { FC, JSX, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Alert, { AlertProps } from "@/components/Alert";
import InputField from "@/components/generic/InputField";
import SelectField from "@/components/generic/SelectField";
import { CategoryType } from "@/models/types";

interface CreateFormProps {
  categoryId: number;
  descriptionTemplate: CategoryType["description_template"];
}

const CreateForm: FC<CreateFormProps> = ({ categoryId, descriptionTemplate }): JSX.Element => {
  const [formFields, setFormFields] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<AlertProps>();
  const [feedbackMessageOpen, setFeedbackMessageOpen] = useState(false);
  const { control, handleSubmit, reset, clearErrors } = useForm();

  useEffect(() => {
    if (descriptionTemplate) {
      const fields = Object.keys(descriptionTemplate);
      setFormFields(fields);
      const defaultValues: Record<string, any> = {};
      fields.forEach((field) => {
        const fieldDef = descriptionTemplate[field];
        if (typeof fieldDef === "object" && fieldDef.type === "select") {
          defaultValues[field] = "";
        } else if (typeof fieldDef === "object" && fieldDef.type === "number") {
          defaultValues[field] = 0;
        } else {
          defaultValues[field] = "";
        }
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
      categoryId,
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
        {formFields.map((field) => {
          const fieldDef = descriptionTemplate[field];

          if (typeof fieldDef === "object" && fieldDef.type === "select" && fieldDef.options) {
            return (
              <div key={field}>
                <SelectField
                  name={field}
                  label={field}
                  control={control}
                  options={fieldDef.options.map((opt) => ({ value: opt, label: opt }))}
                  size="small"
                />
              </div>
            );
          }

          return (
            <div key={field}>
              <InputField
                name={field}
                label={field}
                control={control}
                size="small"
                rules={{
                  ...(fieldDef?.required && { required: "Ce champ est requis" }),
                  ...(typeof fieldDef === "object" &&
                    fieldDef.type === "number" && {
                      valueAsNumber: true,
                      validate: (value) => !isNaN(value) || "Ce champ doit être un nombre",
                    }),
                }}
              />
            </div>
          );
        })}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateForm;
