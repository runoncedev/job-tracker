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

import Card from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useFormStatus } from "react-dom";
import type { Database, Tables } from "../database.types";

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

const FormFields = ({
  application,
}: {
  application?: Tables<"applications"> | null;
}) => {
  return (
    <>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        defaultValue={application?.company || ""}
        className="rounded-md border border-gray-300 p-2"
        required
      />
      <label htmlFor="status">Status</label>
      <select
        id="status"
        name="status"
        defaultValue={application?.status || "active"}
        className="rounded-md border border-gray-300 p-2"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <label htmlFor="notes">Notes</label>
      <textarea
        id="notes"
        name="notes"
        defaultValue={application?.notes || ""}
        className="rounded-md border border-gray-300 p-2"
      />
      {application?.applied_date && (
        <p>
          Applied on{" "}
          {new Date(application.applied_date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </>
  );
};

const FormSubmitButton = ({ isEditing }: { isEditing?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
      disabled={pending}
    >
      {pending ? "Submitting..." : isEditing ? "Update" : "Submit"}
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
    updated_at: new Date().toISOString(),
  });
};

const handleUpdateJob = async (formData: FormData, applicationId: string) => {
  const title = formData.get("title");
  const status = formData.get("status");
  const notes = formData.get("notes");

  await supabase
    .from("applications")
    .update({
      company: typeof title === "string" ? title : "",
      status: typeof status === "string" ? status : "",
      notes: typeof notes === "string" ? notes : "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);
};

type ApplicationsProps = {
  onEditClick: (application: Tables<"applications">) => void;
};

const Applications = ({ onEditClick }: ApplicationsProps) => {
  const { isPending, data } = useQuery({
    queryKey: ["applications"],
    queryFn: async () =>
      await supabase
        .from("applications")
        .select("*")
        .order("updated_at", { ascending: false }),
  });

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center self-stretch text-gray-300">
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
    );
  }

  return (
    <div className="flex flex-grow flex-col flex-wrap items-stretch gap-2 sm:flex-grow-0 sm:flex-row sm:items-start">
      {!isPending && data?.data?.length === 0 && (
        <div className="text-gray-500">No applications found</div>
      )}
      {data?.data?.map((application) => (
        <Card>
          <div className="flex min-w-0 flex-grow flex-col gap-2 py-1.5 pl-1.5">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {application.company}
            </div>
            <div className="flex items-center gap-2">
              <div className="self-start rounded-md bg-green-500 px-2 text-white">
                {application.status}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(application.applied_date).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                )}
              </div>
            </div>
          </div>
          <button
            className="m-2 rounded-sm p-1.5 text-gray-400 hover:bg-gray-100"
            onClick={() => onEditClick(application)}
          >
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
        </Card>
      ))}
    </div>
  );
};

type ApplicationFormProps = {
  children: React.ReactNode;
  className?: string;
  application?: Tables<"applications"> | null;
  onSuccess: () => void;
};

const ApplicationForm = ({
  children,
  className,
  application,
  onSuccess,
}: ApplicationFormProps) => {
  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      if (application) {
        return handleUpdateJob(formData, application.id);
      } else {
        return handleAddJob(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      onSuccess();
    },
  });

  return (
    <form action={mutation.mutateAsync} className={className}>
      {children}
    </form>
  );
};

function App() {
  const [open, setOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Tables<"applications"> | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEditClick = (application: Tables<"applications">) => {
    setEditingApplication(application);
    setOpen(true);
  };

  const handleAddClick = () => {
    setEditingApplication(null);
    setOpen(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex h-dvh max-w-[800px] flex-col gap-4 p-4">
        <div className="self-end sm:self-start">
          {isDesktop && (
            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <button
                  className={addJobButtonClassName}
                  onClick={handleAddClick}
                >
                  <AddJobButtonChildren />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <ApplicationForm
                  className="flex flex-col gap-4"
                  application={editingApplication}
                  onSuccess={() => setOpen(false)}
                >
                  <div className="flex flex-col gap-2">
                    <FormFields application={editingApplication} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormSubmitButton isEditing={!!editingApplication} />
                    <button
                      type="button"
                      className="rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </ApplicationForm>
              </DialogContent>
            </Dialog>
          )}
          {!isDesktop && (
            <Drawer open={open} onOpenChange={handleOpenChange}>
              <DrawerTrigger
                className={addJobButtonClassName}
                onClick={handleAddClick}
              >
                <AddJobButtonChildren />
              </DrawerTrigger>
              <DrawerContent>
                <ApplicationForm
                  application={editingApplication}
                  onSuccess={() => setOpen(false)}
                >
                  <div className="flex flex-col gap-2 px-4">
                    <FormFields application={editingApplication} />
                  </div>
                  <DrawerFooter className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded-md bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                    >
                      {editingApplication ? "Update" : "Submit"}
                    </button>
                    <DrawerClose className="rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300">
                      Cancel
                    </DrawerClose>
                  </DrawerFooter>
                </ApplicationForm>
              </DrawerContent>
            </Drawer>
          )}
        </div>
        <Applications onEditClick={handleEditClick} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
