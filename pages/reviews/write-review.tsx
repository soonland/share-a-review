import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { ZodTooBigIssue, ZodTooSmallIssue, z } from "zod";

import Alert, { AlertProps } from "@/components/Alert";
import InputField from "@/components/generic/InputField";
import RatingField from "@/components/generic/RatingField";
import SelectField from "@/components/generic/SelectField";

export const schema = z.object({
  item: z.string().min(1, "form.fieldRequired"),
  title: z.string().min(10, "form.minLengthRequired").max(100, "form.maxLengthExceeded"),
  content: z.string().min(1, "form.fieldRequired"),
  rating: z.string().min(1, "form.fieldRequired"),
});

interface IFormInputs {
  title: string;
  content: string;
  item: string;
  rating: string;
}

const WriteReviews = () => {
  const { t } = useTranslation("common");
  const session = useSession();
  const [feedbackMessage, setFeedbackMessage] = useState<AlertProps>();
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
      item: "",
      rating: "5",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const payload = {
      ...data,
      itemId: parseInt(data.item),
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

  const handleFormSubmit = (data) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      validation.error.errors.forEach((error) => {
        switch (error.code) {
          case "too_small":
            setError(error.path[0] as keyof IFormInputs, {
              message: t(error.message, { value: (error as ZodTooSmallIssue).minimum }),
            });
            break;
          case "too_big":
            setError(error.path[0] as keyof IFormInputs, {
              message: t(error.message, { value: (error as ZodTooBigIssue).maximum }),
            });
            break;
          default:
            setError(error.path[0] as keyof IFormInputs, { message: t(error.message) });
            break;
        }
      });
      return;
    }
    onSubmit(data);
  };

  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    clearTimeout(timeoutId);
    return fetch(`${url}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "An error occurred while fetching the data." };
        }
        return res.json();
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  };

  const { data, isLoading } = useSWR(`/api/items`, fetcher);

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
      {feedbackMessage && <Alert severity={feedbackMessage.severity} message={feedbackMessage.message} />}
      <br />
      <Box>
        <SelectField
          name="item"
          control={control}
          label={t("form.writeReview.item")}
          rules={{ required: t("form.fieldRequired") }}
          disabled={session.status !== "authenticated"}
          size="small"
          isLoading={isLoading}
          error={errors.item?.message}
          options={data?.data.map((item) => ({
            value: item.id.toString(),
            label: `${item.category_name} - ${item.name}`,
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
        <RatingField
          name="rating"
          control={control}
          label={t("form.writeReview.rating")}
          rules={{ required: t("form.fieldRequired") }}
          disabled={session.status !== "authenticated"}
          size="small"
          error={errors.rating?.message}
        />
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
