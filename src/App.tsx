import Button from "@/components/ui/Button";
import Card from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createClient, type Session } from "@supabase/supabase-js";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection, useLiveQuery } from "@tanstack/react-db";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Database, Tables } from "../database.types";

const supabaseUrl = "https://scxwpgmelmbwtljbvtwp.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const queryClient = new QueryClient();

const apllicationCollection = createCollection<Tables<"applications">>(
  queryCollectionOptions({
    queryClient,
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select("*")
        .order("updated_at", { ascending: false });

      return data || [];
    },
    getKey: (item) => item.id,
    // Handle all CRUD operations
    onInsert: async ({ transaction }) => {
      const { modified: newApplication } = transaction.mutations[0];

      await supabase.from("applications").insert(newApplication);
    },
    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];

      await supabase
        .from("applications")
        .update(modified)
        .eq("id", original.id);
    },
    onDelete: async ({ transaction }) => {
      const { original } = transaction.mutations[0];

      await supabase.from("applications").delete().eq("id", original.id);
    },
  }),
);

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
    <Button>
      {pending ? "Submitting..." : isEditing ? "Update" : "Submit"}
    </Button>
  );
};

type ApplicationsProps = {
  onEditClick: (application: Tables<"applications">) => void;
};

const Applications = ({ onEditClick }: ApplicationsProps) => {
  const { data: liveData, isLoading: isLiveLoading } = useLiveQuery((q) =>
    q
      .from({ application: apllicationCollection })
      .orderBy(({ application }) => application.updated_at, {
        direction: "desc",
      }),
  );

  if (isLiveLoading) {
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
      {!isLiveLoading && liveData?.length === 0 && (
        <div className="text-gray-500">No applications found</div>
      )}
      {liveData?.map((application) => (
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
  const mutate = (formData: FormData) => {
    onSuccess();

    if (application) {
      apllicationCollection.update(application.id, (draft) => {
        draft.company = formData.get("title") as string;
        draft.status = formData.get("status") as string;
        draft.notes = formData.get("notes") as string;
        draft.updated_at = new Date().toUTCString();
      });
    } else {
      apllicationCollection.insert({
        id: crypto.randomUUID(),
        created_at: new Date().toUTCString(),
        deleted_at: null,
        applied_date: new Date().toUTCString(),
        company: formData.get("title") as string,
        status: formData.get("status") as string,
        notes: formData.get("notes") as string,
        updated_at: new Date().toUTCString(),
      });
    }
  };

  return (
    <form action={mutate} className={className}>
      {children}
    </form>
  );
};

const SignInButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} className="w-full">
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
};

const SignOutButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} variant="text">
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
};

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Tables<"applications"> | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // if (!session) {
  //   return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  // }

  if (!session) {
    return (
      <div className="flex h-dvh items-center justify-center px-4">
        <form
          action={async () => {
            await supabase.auth.signInWithPassword({
              email,
              password,
            });
          }}
          className="w-full max-w-md space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-300 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-gray-300 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SignInButton />
        </form>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex h-dvh max-w-[800px] flex-col gap-4 p-4">
        <div className="flex w-full justify-between gap-2 self-end sm:self-start">
          {isDesktop && (
            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleAddClick}
                >
                  <AddJobButtonChildren />
                </Button>
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
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    {editingApplication && (
                      <Button
                        type="button"
                        className="bg-red-200 hover:bg-red-300"
                        onClick={() => {
                          apllicationCollection.delete(editingApplication.id);
                          setOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </ApplicationForm>
              </DialogContent>
            </Dialog>
          )}
          {!isDesktop && (
            <Drawer
              open={open}
              onOpenChange={handleOpenChange}
              repositionInputs={false}
            >
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
                    <Button type="submit">
                      {editingApplication ? "Update" : "Submit"}
                    </Button>
                    <DrawerClose className="rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300">
                      Cancel
                    </DrawerClose>
                    {editingApplication && (
                      <Button
                        type="button"
                        className="bg-red-200 hover:bg-red-300"
                        onClick={() => {
                          apllicationCollection.delete(editingApplication.id);
                          setOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </DrawerFooter>
                </ApplicationForm>
              </DrawerContent>
            </Drawer>
          )}
          <form
            action={async () => {
              await supabase.auth.signOut();
            }}
          >
            <SignOutButton />
          </form>
        </div>
        <Applications onEditClick={handleEditClick} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
