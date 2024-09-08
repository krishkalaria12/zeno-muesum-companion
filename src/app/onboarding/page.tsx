"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2 } from "lucide-react";
import { env } from "@/env";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  about: z.string().min(10, { message: "About must be at least 10 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  timings: z.string().min(5, { message: "Timings must be at least 5 characters." }),
  pricingType: z.enum(["fixed", "variable"]),
  fixedPrice: z.number().optional(),
  sections: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
  googleMapsLink: z.string().url({ message: "Please enter a valid URL." }),
  personalEmail: z.string().email({ message: "Please enter a valid email." }),
  museumEmail: z.string().email({ message: "Please enter a valid email." }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }),
  images: z.array(
    typeof window !== "undefined" && File ? z.instanceof(File) : z.any()
  ),
});

type FormValues = z.infer<typeof formSchema>;

export default function OnboardingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      about: "",
      address: "",
      state: "",
      city: "",
      phoneNumber: "",
      timings: "",
      pricingType: "fixed",
      fixedPrice: 0,
      sections: [],
      googleMapsLink: "",
      personalEmail: "",
      museumEmail: "",
      instagram: "",
      facebook: "",
      website: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/museumowners?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.museum) {
            form.reset(data.museum);
          }
        }
      } catch (error) {
        console.error("Error fetching existing data:", error);
      }
    };
    fetchExistingData();
  }, [userId, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Client-side validation
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Validate numeric fields
      // ... existing code ...
      if (
        data.pricingType === "fixed" &&
        (isNaN(data.fixedPrice ?? 0) || (data.fixedPrice ?? 0) < 0)
      ) {
        throw new Error("Invalid fixed price");
      }
      // ... existing code ...
      if (data.pricingType === "variable") {
        if (!data.sections) {
          throw new Error("Sections are required for variable pricing");
        }
        data.sections.forEach((section, index) => {
          if (isNaN(section.price) || section.price < 0) {
            throw new Error(`Invalid price for section ${index + 1}`);
          }
        });
      }

      // Upload images to Cloudinary
      const imageUrls = await Promise.all(
        data.images.map(async (image) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append(
            "upload_preset",
            env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          );
          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData },
          );
          if (!cloudinaryResponse.ok) {
            const errorData = await cloudinaryResponse.text();
            throw new Error(
              `Failed to upload image to Cloudinary: ${errorData}`,
            );
          }
          const cloudinaryData = await cloudinaryResponse.json();
          return cloudinaryData.secure_url;
        }),
      );

      const apiData = {
        ...data,
        images: imageUrls,
        ticketDetails: {
          isSubTicketing: data.pricingType === "variable",
          sections: data.pricingType === "variable" ? data.sections : [],
        },
        fixedPrice: data.pricingType === "fixed" ? data.fixedPrice : undefined,
        owner: userId, // Associate the museum with the current user
        email: data.museumEmail, // Add this line to include the museum email
      };

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to submit form: ${errorData}`);
      }

      const result = await response.json();
      console.log("Museum created:", result.data);
      router.push("/onboarding/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Display error to the user
      // You might want to use a toast or alert component here
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Museum Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter museum name"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">About</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description about the museum"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter state"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter museum address"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="timings"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Timings</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter museum timings"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Pricing Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                        <SelectValue placeholder="Select pricing type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-gray-600 bg-gray-700 text-white">
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {form.watch("pricingType") === "fixed" && (
              <FormField
                control={form.control}
                name="fixedPrice"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Fixed Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter fixed price"
                        {...field}
                        onChange={(e: any) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            )}
            {form.watch("pricingType") === "variable" && (
              <VariablePricingSection form={form} />
            )}
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setStep(1)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Previous
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="googleMapsLink"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Google Maps Link
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Google Maps link"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalEmail"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Personal Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter personal email"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="museumEmail"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Museum Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter museum email"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Instagram</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Instagram handle"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Facebook</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Facebook page"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter website URL"
                      {...field}
                      className="border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e: any) =>
                        field.onChange(Array.from(e.target.files || []))
                      }
                      className="border-gray-600 bg-gray-700 text-white"
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Upload images of your museum (max 5)
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-2xl rounded-lg bg-gray-800 p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Museum Onboarding
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

function VariablePricingSection({ form }: { form: any }) {
  const [sections, setSections] = useState([{ name: "", price: 0 }]);

  const addSection = () => {
    setSections([...sections, { name: "", price: 0 }]);
  };

  return (
    <>
      {sections.map((section, index) => (
        <div key={index} className="mb-2 flex space-x-2">
          <Input
            placeholder="Section name"
            value={section.name}
            onChange={(e: any) => {
              const newSections = [...sections];
              newSections[index]!.name = e.target.value;
              setSections(newSections);
              form.setValue("sections", newSections);
            }}
          />
          <Input
            type="number"
            placeholder="Price"
            value={section.price}
            onChange={(e: any) => {
              const newSections = [...sections];
              newSections[index]!.price = parseFloat(e.target.value);
              setSections(newSections);
              form.setValue("sections", newSections);
            }}
          />
        </div>
      ))}
      <Button type="button" onClick={addSection} className="mt-2 w-full">
        Add Section
      </Button>
    </>
  );
}
