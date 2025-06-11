import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  User,
  FileText,
  Clock,
  Map,
  Home,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

// Form schemas for each step
const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
});

const medicalHistorySchema = z.object({
  previousTreatments: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  familyHistory: z.string().optional(),
});

const fertilityJourneySchema = z.object({
  tryingToConceiveSince: z
    .string()
    .min(1, { message: "This field is required" }),
  previousIVFAttempts: z.string().min(1, { message: "This field is required" }),
  challenges: z.string().optional(),
  expectations: z.string().optional(),
});

const treatmentPathwaySchema = z.object({
  preferredTreatment: z
    .string()
    .min(1, { message: "Please select a treatment option" }),
  timeframe: z.string().min(1, { message: "Please select a timeframe" }),
  additionalNotes: z.string().optional(),
});

const PatientOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalDetails: {},
    medicalHistory: {},
    fertilityJourney: {},
    treatmentPathway: {},
  });

  // Personal details form
  const personalDetailsForm = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
  });

  // Medical history form
  const medicalHistoryForm = useForm({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      previousTreatments: "",
      medicalConditions: "",
      medications: "",
      allergies: "",
      familyHistory: "",
    },
  });

  // Fertility journey form
  const fertilityJourneyForm = useForm({
    resolver: zodResolver(fertilityJourneySchema),
    defaultValues: {
      tryingToConceiveSince: "",
      previousIVFAttempts: "",
      challenges: "",
      expectations: "",
    },
  });

  // Treatment pathway form
  const treatmentPathwayForm = useForm({
    resolver: zodResolver(treatmentPathwaySchema),
    defaultValues: {
      preferredTreatment: "",
      timeframe: "",
      additionalNotes: "",
    },
  });

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmitPersonalDetails = (data) => {
    setFormData({ ...formData, personalDetails: data });
    nextStep();
  };

  const onSubmitMedicalHistory = (data) => {
    setFormData({ ...formData, medicalHistory: data });
    nextStep();
  };

  const onSubmitFertilityJourney = (data) => {
    setFormData({ ...formData, fertilityJourney: data });
    nextStep();
  };

  const onSubmitTreatmentPathway = (data) => {
    setFormData({ ...formData, treatmentPathway: data });
    // Here you would typically submit the complete form data to your backend
    console.log("Complete form data:", { ...formData, treatmentPathway: data });
    // For now, we'll just show an alert
    alert("Patient onboarding completed successfully!");
  };

  const saveProgress = () => {
    console.log("Saving progress...", formData);
    alert("Progress saved successfully!");
  };

  const getProgressPercentage = () => {
    return (step / 4) * 100;
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-4xl mx-auto mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Patient Onboarding
          </CardTitle>
          <CardDescription>
            Complete the following steps to onboard a new patient to the IVF
            counseling program.
          </CardDescription>
          <div className="mt-4">
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <div className={`${step >= 1 ? "text-primary font-medium" : ""}`}>
                Personal Details
              </div>
              <div className={`${step >= 2 ? "text-primary font-medium" : ""}`}>
                Medical History
              </div>
              <div className={`${step >= 3 ? "text-primary font-medium" : ""}`}>
                Fertility Journey
              </div>
              <div className={`${step >= 4 ? "text-primary font-medium" : ""}`}>
                Treatment Pathway
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <User className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Personal Details</h3>
              </div>
              <Form {...personalDetailsForm}>
                <form
                  onSubmit={personalDetailsForm.handleSubmit(
                    onSubmitPersonalDetails,
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalDetailsForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalDetailsForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalDetailsForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalDetailsForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalDetailsForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalDetailsForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit">
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Medical History</h3>
              </div>
              <Form {...medicalHistoryForm}>
                <form
                  onSubmit={medicalHistoryForm.handleSubmit(
                    onSubmitMedicalHistory,
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={medicalHistoryForm.control}
                    name="previousTreatments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Fertility Treatments</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select previous treatments" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No previous treatments
                            </SelectItem>
                            <SelectItem value="iui">
                              IUI (Intrauterine Insemination)
                            </SelectItem>
                            <SelectItem value="ivf">
                              IVF (In Vitro Fertilization)
                            </SelectItem>
                            <SelectItem value="icsi">
                              ICSI (Intracytoplasmic Sperm Injection)
                            </SelectItem>
                            <SelectItem value="ovulation-induction">
                              Ovulation Induction (Clomid/Letrozole)
                            </SelectItem>
                            <SelectItem value="laparoscopy">
                              Laparoscopic Surgery
                            </SelectItem>
                            <SelectItem value="hysteroscopy">
                              Hysteroscopic Surgery
                            </SelectItem>
                            <SelectItem value="donor-eggs">
                              Donor Egg Treatment
                            </SelectItem>
                            <SelectItem value="donor-sperm">
                              Donor Sperm Treatment
                            </SelectItem>
                            <SelectItem value="frozen-embryo">
                              Frozen Embryo Transfer (FET)
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple treatments (combination)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the most recent or primary treatment received.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={medicalHistoryForm.control}
                    name="medicalConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relevant Medical Conditions</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medical conditions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No known conditions
                            </SelectItem>
                            <SelectItem value="pcos">
                              PCOS (Polycystic Ovary Syndrome)
                            </SelectItem>
                            <SelectItem value="endometriosis">
                              Endometriosis
                            </SelectItem>
                            <SelectItem value="thyroid">
                              Thyroid Disorders
                            </SelectItem>
                            <SelectItem value="diabetes">Diabetes</SelectItem>
                            <SelectItem value="autoimmune">
                              Autoimmune Disorders
                            </SelectItem>
                            <SelectItem value="fibroids">
                              Uterine Fibroids
                            </SelectItem>
                            <SelectItem value="blocked-tubes">
                              Blocked Fallopian Tubes
                            </SelectItem>
                            <SelectItem value="male-factor">
                              Male Factor Infertility
                            </SelectItem>
                            <SelectItem value="unexplained">
                              Unexplained Infertility
                            </SelectItem>
                            <SelectItem value="ovulation-disorders">
                              Ovulation Disorders
                            </SelectItem>
                            <SelectItem value="premature-ovarian">
                              Premature Ovarian Insufficiency
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple conditions
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the primary condition affecting fertility.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={medicalHistoryForm.control}
                      name="medications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Medications</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select current medications" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                No current medications
                              </SelectItem>
                              <SelectItem value="prenatal-vitamins">
                                Prenatal Vitamins/Folic Acid
                              </SelectItem>
                              <SelectItem value="metformin">
                                Metformin (for PCOS/Diabetes)
                              </SelectItem>
                              <SelectItem value="thyroid-medication">
                                Thyroid Medication (Levothyroxine)
                              </SelectItem>
                              <SelectItem value="birth-control">
                                Birth Control Pills
                              </SelectItem>
                              <SelectItem value="clomid">
                                Clomid (Clomiphene Citrate)
                              </SelectItem>
                              <SelectItem value="letrozole">
                                Letrozole (Femara)
                              </SelectItem>
                              <SelectItem value="progesterone">
                                Progesterone Supplements
                              </SelectItem>
                              <SelectItem value="coq10">
                                CoQ10 Supplements
                              </SelectItem>
                              <SelectItem value="dhea">
                                DHEA Supplements
                              </SelectItem>
                              <SelectItem value="antidepressants">
                                Antidepressants
                              </SelectItem>
                              <SelectItem value="blood-pressure">
                                Blood Pressure Medication
                              </SelectItem>
                              <SelectItem value="multiple">
                                Multiple medications
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={medicalHistoryForm.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select allergies" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                No known allergies
                              </SelectItem>
                              <SelectItem value="penicillin">
                                Penicillin
                              </SelectItem>
                              <SelectItem value="sulfa">Sulfa drugs</SelectItem>
                              <SelectItem value="latex">Latex</SelectItem>
                              <SelectItem value="iodine">
                                Iodine/Contrast dye
                              </SelectItem>
                              <SelectItem value="aspirin">
                                Aspirin/NSAIDs
                              </SelectItem>
                              <SelectItem value="codeine">
                                Codeine/Opioids
                              </SelectItem>
                              <SelectItem value="environmental">
                                Environmental (pollen, dust)
                              </SelectItem>
                              <SelectItem value="food">
                                Food allergies
                              </SelectItem>
                              <SelectItem value="shellfish">
                                Shellfish
                              </SelectItem>
                              <SelectItem value="nuts">Nuts</SelectItem>
                              <SelectItem value="multiple">
                                Multiple allergies
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={medicalHistoryForm.control}
                    name="familyHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family Medical History</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select family history" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No significant family history
                            </SelectItem>
                            <SelectItem value="fertility-issues">
                              Fertility issues in family
                            </SelectItem>
                            <SelectItem value="diabetes">Diabetes</SelectItem>
                            <SelectItem value="heart-disease">
                              Heart Disease
                            </SelectItem>
                            <SelectItem value="cancer">
                              Cancer (any type)
                            </SelectItem>
                            <SelectItem value="breast-cancer">
                              Breast/Ovarian Cancer
                            </SelectItem>
                            <SelectItem value="thyroid">
                              Thyroid Disorders
                            </SelectItem>
                            <SelectItem value="autoimmune">
                              Autoimmune Disorders
                            </SelectItem>
                            <SelectItem value="mental-health">
                              Mental Health Conditions
                            </SelectItem>
                            <SelectItem value="genetic-disorders">
                              Genetic Disorders
                            </SelectItem>
                            <SelectItem value="pregnancy-complications">
                              Pregnancy Complications
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple conditions
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the most relevant family medical history.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button type="submit">
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Fertility Journey</h3>
              </div>
              <Form {...fertilityJourneyForm}>
                <form
                  onSubmit={fertilityJourneyForm.handleSubmit(
                    onSubmitFertilityJourney,
                  )}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={fertilityJourneyForm.control}
                      name="tryingToConceiveSince"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trying to Conceive Since</FormLabel>
                          <FormControl>
                            <Input type="month" {...field} />
                          </FormControl>
                          <FormDescription>
                            When did the patient start trying to conceive?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={fertilityJourneyForm.control}
                      name="previousIVFAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous IVF Attempts</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select number of attempts" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4+">4 or more</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={fertilityJourneyForm.control}
                    name="challenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Challenges Faced</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary challenges" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="emotional-stress">
                              Emotional stress and anxiety
                            </SelectItem>
                            <SelectItem value="relationship-strain">
                              Relationship strain with partner
                            </SelectItem>
                            <SelectItem value="financial-burden">
                              Financial burden of treatments
                            </SelectItem>
                            <SelectItem value="work-life-balance">
                              Work-life balance difficulties
                            </SelectItem>
                            <SelectItem value="social-isolation">
                              Social isolation and stigma
                            </SelectItem>
                            <SelectItem value="physical-discomfort">
                              Physical discomfort from treatments
                            </SelectItem>
                            <SelectItem value="repeated-failures">
                              Repeated treatment failures
                            </SelectItem>
                            <SelectItem value="family-pressure">
                              Family and social pressure
                            </SelectItem>
                            <SelectItem value="time-management">
                              Time management with appointments
                            </SelectItem>
                            <SelectItem value="decision-making">
                              Difficulty making treatment decisions
                            </SelectItem>
                            <SelectItem value="hope-despair">
                              Cycles of hope and despair
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple challenges
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the most significant challenge experienced.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fertilityJourneyForm.control}
                    name="expectations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Treatment Goal</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary goal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="biological-child">
                              Have a biological child
                            </SelectItem>
                            <SelectItem value="successful-pregnancy">
                              Achieve a successful pregnancy
                            </SelectItem>
                            <SelectItem value="healthy-baby">
                              Deliver a healthy baby
                            </SelectItem>
                            <SelectItem value="complete-family">
                              Complete our family
                            </SelectItem>
                            <SelectItem value="explore-options">
                              Explore all available options
                            </SelectItem>
                            <SelectItem value="understand-diagnosis">
                              Better understand our diagnosis
                            </SelectItem>
                            <SelectItem value="emotional-support">
                              Receive emotional support
                            </SelectItem>
                            <SelectItem value="second-child">
                              Have a second child
                            </SelectItem>
                            <SelectItem value="preserve-fertility">
                              Preserve fertility for future
                            </SelectItem>
                            <SelectItem value="donor-options">
                              Explore donor options
                            </SelectItem>
                            <SelectItem value="adoption-consideration">
                              Consider adoption alternatives
                            </SelectItem>
                            <SelectItem value="peace-of-mind">
                              Find peace with our journey
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the most important goal for this treatment
                          journey.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button type="submit">
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <Map className="mr-2 h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Treatment Pathway</h3>
              </div>
              <Form {...treatmentPathwayForm}>
                <form
                  onSubmit={treatmentPathwayForm.handleSubmit(
                    onSubmitTreatmentPathway,
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={treatmentPathwayForm.control}
                    name="preferredTreatment"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Preferred Treatment Option</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="ivf" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                IVF (In Vitro Fertilization)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="icsi" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                ICSI (Intracytoplasmic Sperm Injection)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="iui" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                IUI (Intrauterine Insemination)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="donor" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Donor Eggs/Sperm/Embryos
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="surrogacy" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Surrogacy
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="undecided" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Undecided/Need Guidance
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={treatmentPathwayForm.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Timeframe</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">
                              Ready to start immediately
                            </SelectItem>
                            <SelectItem value="1-3months">
                              Within 1-3 months
                            </SelectItem>
                            <SelectItem value="3-6months">
                              Within 3-6 months
                            </SelectItem>
                            <SelectItem value="6-12months">
                              Within 6-12 months
                            </SelectItem>
                            <SelectItem value="undecided">Undecided</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          When would the patient like to begin treatment?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={treatmentPathwayForm.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Considerations</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select special considerations" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No special considerations
                            </SelectItem>
                            <SelectItem value="religious-cultural">
                              Religious or cultural considerations
                            </SelectItem>
                            <SelectItem value="work-schedule">
                              Work schedule constraints
                            </SelectItem>
                            <SelectItem value="travel-distance">
                              Travel distance to clinic
                            </SelectItem>
                            <SelectItem value="financial-limitations">
                              Financial limitations
                            </SelectItem>
                            <SelectItem value="partner-availability">
                              Partner availability issues
                            </SelectItem>
                            <SelectItem value="previous-trauma">
                              Previous medical trauma
                            </SelectItem>
                            <SelectItem value="needle-phobia">
                              Needle phobia or medical anxiety
                            </SelectItem>
                            <SelectItem value="language-barrier">
                              Language or communication needs
                            </SelectItem>
                            <SelectItem value="disability-accommodation">
                              Disability accommodations needed
                            </SelectItem>
                            <SelectItem value="mental-health">
                              Mental health considerations
                            </SelectItem>
                            <SelectItem value="multiple">
                              Multiple considerations
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button type="submit">Complete Onboarding</Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </CardContent>

        <Separator className="my-2" />

        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">Step {step} of 4</div>
          <Button variant="outline" size="sm" onClick={saveProgress}>
            <Save className="mr-2 h-4 w-4" /> Save Progress
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientOnboarding;
