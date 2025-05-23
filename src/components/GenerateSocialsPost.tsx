import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Loader2Icon,
  TwitterIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef } from "react";

const FormSchema = z.object({
  type: z.string().min(1, { message: "Platform is required." }),
  system_prompt: z
    .string()
    .min(10, { message: "Prompt should have at least 10 characters!" }),
});

export default function GenerateSocialsPost({
  IsVideoAnalysisEnabled,
  prompt,
  handleSubmit,
  status,
}: {
  IsVideoAnalysisEnabled: boolean;
  prompt: string;
  handleSubmit: (platform: string, prompt: string) => void;
  status: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      system_prompt: prompt,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    if (btnRef.current) {
      btnRef.current.click();
    }
    handleSubmit(data.type, data.system_prompt);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  shadow  rounded-2xl cursor-pointer h-9 px-4 py-2 flex-shrink-0 text-xs text-dark-600 hover:text-dark-800 disabled:cursor-not-allowed disabled:text-dark-300 dark:text-light-400 dark:hover:text-light-200 dark:disabled:text-light-600"
          disabled={
            status === "streaming" ||
            status === "submitted" ||
            !IsVideoAnalysisEnabled
          }
        >
          <LinkedinIcon className="w-4 h-4" />
          {IsVideoAnalysisEnabled ? (
            <span>Generate Socials Post</span>
          ) : (
            <span>Upgrade to Generate a Socials Post</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate a Social Media Post</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LinkedIn">
                          <div className="flex items-center gap-2">
                            <LinkedinIcon />
                            LinkedIn
                          </div>
                        </SelectItem>
                        <SelectItem value="X(Twitter)">
                          <div className="flex items-center gap-2">
                            <TwitterIcon />
                            X(Twitter)
                          </div>
                        </SelectItem>
                        <SelectItem value="Facebook">
                          <div className="flex items-center gap-2">
                            <FacebookIcon />
                            Facebook
                          </div>
                        </SelectItem>
                        <SelectItem value="Instagram">
                          <div className="flex items-center gap-2">
                            <InstagramIcon />
                            Instagram
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="system_prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Generate a post using the following instructions
                    </FormLabel>
                    <Textarea
                      defaultValue={prompt}
                      placeholder="System Prompt"
                      {...field}
                      suppressContentEditableWarning
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Generate Post"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogClose ref={btnRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
