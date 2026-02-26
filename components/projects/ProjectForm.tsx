"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Project } from "@/types";
import { createProject } from "@/lib/api";
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

const schema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Project name cannot exceed 100 characters."),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof schema>;

interface ProjectFormProps {
  onCreated?: (project: Project) => void;
}

export function ProjectForm({ onCreated }: ProjectFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setSubmitting(true);
    try {
      const { project, message } = await createProject({
        name: values.name,
        description: values.description || "",
      });
    //   toast({
    //     title: "Project created",
    //     description: message,
    //   });
      form.reset();
      onCreated?.(project);
    } catch (err) {
      console.error(err);
    //   toast({
    //     title: "Failed to create project",
    //     description:
    //       err instanceof Error ? err.message : "Something went wrong.",
    //   });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 rounded-lg border border-green-200 bg-white p-3 shadow-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Activity Tracker v1"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional short description of the project."
                  rows={3}
                  {...field}
                  disabled={submitting}
                />
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
          {submitting ? "Creating..." : "Create project"}
        </Button>
      </form>
    </Form>
  );
}
