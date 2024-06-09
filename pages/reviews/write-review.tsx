import { Box, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Alert from "@/components/Alert";
import TitleInput from "@/components/generic/TitleInput";
// import useSWR from "swr";

export const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

interface IFormInputs {
  title: string;
  content: string;
}

const WriteReviews = () => {
  const { t } = useTranslation("common");
  const session = useSession();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    // clearErrors,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.ok) {
        // clearErrors();
      } else {
        setAlertMessage("Failed to submit review");
      }
    });
  };

  const handleFormSubmit = (data) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      console.log("validation", validation.error.errors);
      validation.error.errors.forEach((error) => {
        setError(error.path[0] as keyof IFormInputs, { message: error.message });
      });
      return;
    }
    onSubmit(data);
  };

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
      {alertMessage && <Alert severity="error" message={alertMessage} />}
      <br />
      <Box>
        <TitleInput
          name="title"
          control={control}
          label="Title"
          // rules={{ required: "Title is required" }}
          size="small"
          error={errors.title?.message}
        />
        <TitleInput
          name="content"
          control={control}
          label="Content"
          // rules={{ required: "Content is required" }}
          size="small"
          error={errors.content?.message}
        />
      </Box>
      <br />
      <Button type="submit" variant="contained" color="primary">
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
