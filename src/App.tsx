import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";

import { createClient } from "@supabase/supabase-js";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useFormStatus } from "react-dom";
import type { Database } from "../database.types";

const queryClient = new QueryClient();

const supabaseUrl = "https://scxwpgmelmbwtljbvtwp.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const addJobButtonClassName =
  "bg-gray-200 text-gray-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300";

const AddJobButtonChildren = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-plus-icon lucide-plus text-gray-400"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
      Add job
    </>
  );
};

const FormFields = () => {
  return (
    <>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        className="border border-gray-300 rounded-md p-2"
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        className="border border-gray-300 rounded-md p-2"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <label htmlFor="notes">Notes</label>
      <textarea
        id="notes"
        name="notes"
        className="border border-gray-300 rounded-md p-2"
      />
    </>
  );
};

const FormSubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
      disabled={pending}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
};

const handleAddJob = async (formData: FormData) => {
  const title = formData.get("title");
  const status = formData.get("status");
  const notes = formData.get("notes");

  await supabase.from("applications").insert({
    company: typeof title === "string" ? title : "",
    status: typeof status === "string" ? status : "",
    notes: typeof notes === "string" ? notes : "",
    applied_date: new Date().toISOString(),
  });
};

const Applications = () => {
  const { isPending, data } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => await supabase.from("applications").select("*"),
  });

  return (
    <div className="flex gap-2 sm:flex-row flex-col flex-grow sm:flex-grow-0 items-stretch flex-wrap sm:items-start">
      {isPending && (
        <div className="text-gray-300 self-stretch flex items-center justify-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-loader-circle-icon lucide-loader-circle animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}
      {!isPending && data?.data?.length === 0 && (
        <div className="text-gray-500">No applications found</div>
      )}
      {data?.data?.map((application) => (
        <div className="border border-gray-300 rounded-md flex justify-between items-start gap-2">
          <div className="flex flex-col gap-2  py-4 pl-4 grow">
            <div className="flex gap-4 items-center">
              <div className="text-lg font-semibold text-gray-900">
                {application.company}
              </div>
              <div className="text-white bg-green-500 rounded-md px-2">
                {application.status}
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {new Date(application.applied_date).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            </div>
          </div>
          <button className="text-gray-400 p-1.5 rounded-sm hover:bg-gray-100 m-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-pencil-icon lucide-pencil"
            >
              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

type ApplicationFormProps = {
  children: React.ReactNode;
  className?: string;
};

const ApplicationForm = ({ children, className }: ApplicationFormProps) => {
  const mutation = useMutation({
    mutationFn: handleAddJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  return (
    <form action={mutation.mutate} className={className}>
      {children}
    </form>
  );
};

function App() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  //   const fetchApplications = async () => {
  //     setIsLoading(true);

  //     const { data } = await supabase.from("applications").select("*");

  //     setIsLoading(false);
  //     setApplications(data ?? []);
  //   };

  //   fetchApplications();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-[800px] mx-auto p-4 flex flex-col gap-4 h-dvh">
        <div className="self-end sm:self-start">
          {isDesktop && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className={addJobButtonClassName}>
                  <AddJobButtonChildren />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <ApplicationForm className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <FormFields />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <FormSubmitButton />
                    <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </ApplicationForm>
              </DialogContent>
            </Dialog>
          )}
          {!isDesktop && (
            <Drawer>
              <DrawerTrigger className={addJobButtonClassName}>
                <AddJobButtonChildren />
              </DrawerTrigger>
              <DrawerContent>
                <ApplicationForm>
                  <div className="flex flex-col gap-2 px-4">
                    <FormFields />
                  </div>
                  <DrawerFooter className="flex gap-2">
                    <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
                      Submit
                    </button>
                    <DrawerClose className="border border-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300">
                      Cancel
                    </DrawerClose>
                  </DrawerFooter>
                </ApplicationForm>
              </DrawerContent>
            </Drawer>
          )}
        </div>
        <Applications />
      </div>
    </QueryClientProvider>
  );
}

export default App;
