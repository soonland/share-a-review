import { Box, Button, Collapse } from "@mui/material";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";

import Alert, { AlertProps } from "@/components/Alert";
import AutoCompleteItem from "@/components/generic/AutoCompleteItem";
import InputField from "@/components/generic/InputField";
import RatingField from "@/components/generic/RatingField";
import { useFetch } from "@/helpers/utils";

export const schema = z.object({
  item: z.object({ id: z.string().min(1, "form.fieldRequired") }),
  title: z.string().min(10, "form.minLengthRequired").max(100, "form.maxLengthExceeded"),
  content: z.string().min(1, "form.fieldRequired"),
  rating: z.string().min(1, "form.fieldRequired"),
});

interface IFormInputs {
  title: string;
  content: string;
  item: string | null;
  rating: string;
}

const WriteReviews = () => {
  const { t } = useTranslation();
  const session = useSession();
  const [feedbackMessage, setFeedbackMessage] = useState<AlertProps>();
  const [feedbackMessageOpen, setFeedbackMessageOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      title: "",
      content: "",
      item: null,
      rating: "3",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    console.log("data", data);
    const payload = {
      ...data,
      itemId: parseInt(data.item as string, 10),
      userId: session?.data?.user?.id,
    };
    await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.ok) {
        clearErrors();
        reset();
        setFeedbackMessage({ severity: "success", message: "Review submitted successfully" });
      } else {
        setFeedbackMessage({ severity: "error", message: "An error occurred while submitting the review" });
      }
    });
  };

  const handleFormSubmit = (data: IFormInputs) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      validation.error.issues.forEach((error: z.core.$ZodIssue) => {
        const field = error.path[0] as keyof IFormInputs;
        switch (error.code) {
          case "invalid_type":
            setError(field, { message: t("form.invalidType") });
            break;
          case "too_small":
            setError(field, {
              message: t(error.message, { value: "minimum" in error ? error.minimum : undefined }),
            });
            break;
          case "too_big":
            setError(field, {
              message: t(error.message, { value: "maximum" in error ? error.maximum : undefined }),
            });
            break;
          default:
            setError(field, { message: t(error.message) });
            break;
        }
      });
      return;
    }
    onSubmit(data);
  };

  useEffect(() => {
    if (feedbackMessage) {
      setFeedbackMessageOpen(true);
      const timer = setTimeout(() => {
        setFeedbackMessageOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const { data, isLoading } = useFetch(`/api/items?type=list`);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <h1>{t("writeReview.title")}</h1>
      {session.status === "authenticated" && (
        <Alert
          severity="success"
          message={t("writeReview.isLoggedIn", {
            name: session.data.user.name,
          })}
        />
      )}
      {session.status === "unauthenticated" && (
        <Alert
          severity="info"
          message={t("writeReview.loginRequired", {
            loginUrl: "/api/auth/signin",
          })}
        />
      )}
      {session.status === "loading" && <Alert severity="info" message="Checking your login status..." />}
      {feedbackMessage && (
        <Collapse in={feedbackMessageOpen}>
          <Alert severity={feedbackMessage.severity} message={feedbackMessage.message} />
        </Collapse>
      )}
      <br />
      <Box>
        <AutoCompleteItem
          name="item"
          control={control}
          label={t("form.writeReview.item")}
          rules={{ required: t("form.fieldRequired") }}
          disabled={session.status !== "authenticated"}
          size="small"
          isLoading={isLoading}
          error={errors.item?.message}
          sx={{ mb: 2 }}
          options={data?.data.map((item) => ({
            groupBy: item.category_name,
            id: item.id.toString(),
            label: item.name,
          }))}
        />
        <InputField
          name="title"
          control={control}
          label={t("form.writeReview.title")}
          rules={{ required: t("form.fieldRequired") }}
          disabled={session.status !== "authenticated"}
          size="small"
          error={errors.title?.message}
        />
        <InputField
          name="content"
          control={control}
          label={t("form.writeReview.content")}
          multiline
          rules={{ required: t("form.fieldRequired"), maxLength: 1000 }}
          disabled={session.status !== "authenticated"}
          size="small"
          error={errors.content?.message}
        />
        <RatingField name="rating" control={control} disabled={session.status !== "authenticated"} size="small" />
      </Box>
      <br />
      <Button type="submit" variant="contained" color="primary" disabled={session.status !== "authenticated"}>
        Submit
      </Button>
    </form>
  );
};

export default WriteReviews;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
