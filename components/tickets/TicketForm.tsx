"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project, Ticket, TicketPriority } from "@/types";
import { createTicket } from "@/lib/api";
// import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// zod sxhema to
const baseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title cannot exceed 200 characters."),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters.")
    .optional()
    .or(z.literal("")),
  priority: z
    .enum(["low", "medium", "high", "critical"])
    .default("medium") as z.ZodType<TicketPriority>,
});

const withProjectSchema = baseSchema.extend({
  projectId: z.string().min(1, "Project is required."),
});

type TicketFormValuesWithProject = z.infer<typeof withProjectSchema>;
type TicketFormValuesBase = z.infer<typeof baseSchema>;

interface TicketFormProps {
  projectId?: string;
  projects?: Project[];
  onCreated?: (ticket: Ticket) => void;
}

export function TicketForm({ projectId, projects, onCreated }: TicketFormProps) {

  const [submitting, setSubmitting] = useState(false);

  const schema = projectId ? baseSchema : withProjectSchema;

  const form = useForm<TicketFormValuesWithProject | TicketFormValuesBase>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      ...(projectId ? {} : { projectId: "" }),
    } as any,
  });

  const onSubmit = async (
    values: TicketFormValuesWithProject | TicketFormValuesBase
  ) => {
    setSubmitting(true);
    try {
      const targetProjectId = projectId
        ? projectId
        : (values as TicketFormValuesWithProject).projectId;

      const { ticket, message } = await createTicket({
        title: values.title,
        description: values.description || "",
        projectId: targetProjectId,
        priority: values.priority,
      });

    //   toast({
    //     title: "Ticket created",
    //     description: message,
    //   });

      form.reset({
        title: "",
        description: "",
        priority: "medium",
        ...(projectId ? {} : { projectId: "" }),
      } as any);

      onCreated?.(ticket);
    } catch (err) {
      console.error(err);
    //   toast({
    //     title: "Failed to create ticket",
    //     description:
    //       err instanceof Error ? err.message : "Something went wrong.",
    //   });
    } finally {
      setSubmitting(false);
    }
  };

  const showProjectSelect = !projectId && projects && projects.length > 0;

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={form.handleSubmit(onSubmit as any)}
        className="space-y-3"
      >
        {showProjectSelect && (
          <FormField
            control={form.control}
            name={"projectId" as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects!.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={"title" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Short summary of the work"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"description" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Describe the work to be done (optional)."
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"priority" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#00d800] hover:bg-[#00d800]/90"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create ticket"}
        </Button>
      </form>
    </Form>
  );
}
