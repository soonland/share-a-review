import { Search as SearchIcon } from "@mui/icons-material";
import { Button, InputBase, Stack, alpha, styled } from "@mui/material";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, PropsWithChildren, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import SelectField from "./generic/SelectField";

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "relative",
  border: `1px solid ${alpha(theme.palette.common.black, 0.9)}`,
  borderRadius: 32,
  backgroundColor: theme.palette.common.white,
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const StyledSearch: FC<PropsWithChildren> = ({ children }) => {
  return (
    <StyledStack direction={"row"} justifyContent={"stretch"}>
      {children}
    </StyledStack>
  );
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1),
  },
}));

interface IFormInputs {
  category: string;
  item: string;
}

const SearchForm: FC = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    clearTimeout(timeoutId);
    return (
      fetch(`${url}`, { signal: controller.signal })
        // return fetch(`${url}`)
        .then((res) => {
          if (!res.ok) {
            return { success: false, message: "An error occurred while fetching the data." };
          }
          return res.json();
        })
        .catch((error) => {
          return { success: false, message: error.message };
        })
    );
  };

  const {
    data: dataCategories,
    // isLoading: isLoadingCategories,
    // error: errorCategories,
  } = useSWR(`/api/categories`, fetcher);

  const {
    register,
    control,
    handleSubmit,
    setError,
    // clearErrors,
    // reset,
    getValues,
    setValue,
    // formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      category: "",
      item: "",
    },
  });

  // recupéer les valeurs query et category pour les afficher dans le formulaire
  const query = (router.query?.q as string) || "";
  const category = (router.query?.category as string) || "";

  useEffect(() => {
    setValue("category", category, { shouldValidate: true });
    setValue("item", query, { shouldValidate: true });
  }, [category, query, setValue]);

  return (
    <form
      data-testid="testid.form.searchForm"
      onSubmit={handleSubmit(() => {
        console.log("url", `/reviews/${getValues("category")}?q=${getValues("item")}`);
        const category = `/${getValues("category")}`;
        const item = getValues("item");
        if (!item) {
          setError("item", { type: "manual", message: t("form.fieldRequired") });
          return;
        }
        const url = `/reviews${category}?q=${item}`;
        console.log("url", url);
        router.push(url);
      })}
      noValidate
    >
      <StyledSearch>
        <SelectField
          withLabel={false}
          name="category"
          control={control}
          options={dataCategories?.data}
          placeholder={t("form.select.placeholder.category")}
          sx={{
            flex: "1 1 20%",
            border: 0,
            "& .MuiInputBase-root": {
              border: 0,
              borderBottomLeftRadius: 32,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              paddingLeft: 2,
              borderRight: `1px solid ${alpha("#000", 0.9)}`,
              "& .MuiOutlinedInput-notchedOutline": {
                border: 0,
              },
            },
          }}
        />
        <StyledInputBase
          sx={{ flex: "1 1 65%" }}
          placeholder={t("form.search.placeholder")}
          data-testid="testid.form.inputField.item"
          inputProps={{ "aria-label": "search" }}
          {...register("item", { required: t("form.fieldRequired") })}
        />
        <Button
          type="submit"
          variant="text"
          color="secondary"
          data-testid="testid.form.button.search"
          endIcon={<SearchIcon />}
          sx={{ borderTopRightRadius: 32, borderBottomRightRadius: 32, flex: "1 1 10%" }}
        >
          {t("form.search.submit")}
        </Button>
      </StyledSearch>
    </form>
  );
};

export default SearchForm;
