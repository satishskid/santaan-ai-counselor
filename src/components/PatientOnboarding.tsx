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
import BackToHome from "./BackToHome";

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
import { MultiSelect, Option } from "./ui/multi-select";

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
  previousTreatments: z.array(z.string()).default([]),
  medicalConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),
  surgicalHistory: z.array(z.string()).default([]),
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

// Medical condition options
const previousTreatmentOptions: Option[] = [
  { value: "iui", label: "IUI", description: "Intrauterine Insemination" },
  { value: "ivf", label: "IVF", description: "In Vitro Fertilization" },
  { value: "icsi", label: "ICSI", description: "Intracytoplasmic Sperm Injection" },
  { value: "ovulation-induction", label: "Ovulation Induction", description: "Clomid, Letrozole, or Gonadotropins" },
  { value: "laparoscopy", label: "Laparoscopic Surgery", description: "Minimally invasive surgery" },
  { value: "hysteroscopy", label: "Hysteroscopic Surgery", description: "Uterine cavity surgery" },
  { value: "donor-eggs", label: "Donor Egg Treatment", description: "Using donated eggs" },
  { value: "donor-sperm", label: "Donor Sperm Treatment", description: "Using donated sperm" },
  { value: "frozen-embryo", label: "Frozen Embryo Transfer", description: "FET cycle" },
  { value: "egg-freezing", label: "Egg Freezing", description: "Oocyte cryopreservation" },
  { value: "sperm-freezing", label: "Sperm Freezing", description: "Sperm cryopreservation" },
  { value: "embryo-freezing", label: "Embryo Freezing", description: "Embryo cryopreservation" },
  { value: "pgd-pgs", label: "PGD/PGS", description: "Genetic testing of embryos" },
  { value: "surrogacy", label: "Surrogacy", description: "Gestational carrier" },
  { value: "natural-cycle", label: "Natural Cycle IVF", description: "IVF without stimulation" },
  { value: "mini-ivf", label: "Mini IVF", description: "Minimal stimulation IVF" }
];

const medicalConditionOptions: Option[] = [
  { value: "pcos", label: "PCOS", description: "Polycystic Ovary Syndrome" },
  { value: "endometriosis", label: "Endometriosis", description: "Uterine tissue outside uterus" },
  { value: "thyroid-hypo", label: "Hypothyroidism", description: "Underactive thyroid" },
  { value: "thyroid-hyper", label: "Hyperthyroidism", description: "Overactive thyroid" },
  { value: "diabetes-type1", label: "Type 1 Diabetes", description: "Insulin-dependent diabetes" },
  { value: "diabetes-type2", label: "Type 2 Diabetes", description: "Non-insulin dependent diabetes" },
  { value: "gestational-diabetes", label: "Gestational Diabetes", description: "Diabetes during pregnancy" },
  { value: "autoimmune-lupus", label: "Lupus", description: "Systemic lupus erythematosus" },
  { value: "autoimmune-ra", label: "Rheumatoid Arthritis", description: "Joint inflammation" },
  { value: "autoimmune-aps", label: "Antiphospholipid Syndrome", description: "Blood clotting disorder" },
  { value: "fibroids", label: "Uterine Fibroids", description: "Non-cancerous uterine growths" },
  { value: "blocked-tubes", label: "Blocked Fallopian Tubes", description: "Tubal factor infertility" },
  { value: "male-factor", label: "Male Factor Infertility", description: "Sperm-related issues" },
  { value: "unexplained", label: "Unexplained Infertility", description: "No identifiable cause" },
  { value: "ovulation-disorders", label: "Ovulation Disorders", description: "Irregular or absent ovulation" },
  { value: "premature-ovarian", label: "Premature Ovarian Insufficiency", description: "Early menopause" },
  { value: "diminished-ovarian", label: "Diminished Ovarian Reserve", description: "Low egg count/quality" },
  { value: "adenomyosis", label: "Adenomyosis", description: "Endometrium in uterine wall" },
  { value: "polyps", label: "Uterine Polyps", description: "Growths in uterine lining" },
  { value: "cervical-factor", label: "Cervical Factor", description: "Cervical mucus issues" },
  { value: "recurrent-miscarriage", label: "Recurrent Pregnancy Loss", description: "Multiple miscarriages" },
  { value: "implantation-failure", label: "Implantation Failure", description: "Repeated failed implantation" },
  { value: "genetic-disorders", label: "Genetic Disorders", description: "Inherited conditions" },
  { value: "cancer-history", label: "Cancer History", description: "Previous cancer treatment" },
  { value: "hypertension", label: "High Blood Pressure", description: "Elevated blood pressure" },
  { value: "heart-disease", label: "Heart Disease", description: "Cardiovascular conditions" },
  { value: "kidney-disease", label: "Kidney Disease", description: "Renal conditions" },
  { value: "liver-disease", label: "Liver Disease", description: "Hepatic conditions" },
  { value: "mental-health", label: "Mental Health Conditions", description: "Depression, anxiety, etc." }
];

const medicationOptions: Option[] = [
  { value: "metformin", label: "Metformin", description: "For diabetes/PCOS" },
  { value: "levothyroxine", label: "Levothyroxine", description: "For hypothyroidism" },
  { value: "insulin", label: "Insulin", description: "For diabetes" },
  { value: "clomid", label: "Clomiphene Citrate", description: "Ovulation induction" },
  { value: "letrozole", label: "Letrozole", description: "Ovulation induction" },
  { value: "gonadotropins", label: "Gonadotropins", description: "FSH/LH injections" },
  { value: "birth-control", label: "Birth Control Pills", description: "Hormonal contraception" },
  { value: "progesterone", label: "Progesterone", description: "Hormone supplementation" },
  { value: "estrogen", label: "Estrogen", description: "Hormone replacement" },
  { value: "prenatal-vitamins", label: "Prenatal Vitamins", description: "Pregnancy supplements" },
  { value: "folic-acid", label: "Folic Acid", description: "B vitamin supplement" },
  { value: "vitamin-d", label: "Vitamin D", description: "Vitamin D supplement" },
  { value: "coq10", label: "CoQ10", description: "Antioxidant supplement" },
  { value: "dhea", label: "DHEA", description: "Hormone supplement" },
  { value: "omega3", label: "Omega-3", description: "Fish oil supplement" },
  { value: "antidepressants", label: "Antidepressants", description: "Mental health medication" },
  { value: "anti-anxiety", label: "Anti-anxiety Medication", description: "Anxiety treatment" },
  { value: "blood-thinners", label: "Blood Thinners", description: "Anticoagulation therapy" },
  { value: "steroids", label: "Corticosteroids", description: "Anti-inflammatory medication" },
  { value: "immunosuppressants", label: "Immunosuppressants", description: "Immune system modulators" }
];

const allergyOptions: Option[] = [
  { value: "penicillin", label: "Penicillin", description: "Antibiotic allergy" },
  { value: "sulfa", label: "Sulfa Drugs", description: "Sulfonamide allergy" },
  { value: "latex", label: "Latex", description: "Natural rubber allergy" },
  { value: "iodine", label: "Iodine/Contrast Dye", description: "Contrast media allergy" },
  { value: "aspirin", label: "Aspirin", description: "NSAID allergy" },
  { value: "codeine", label: "Codeine", description: "Opioid allergy" },
  { value: "morphine", label: "Morphine", description: "Opioid allergy" },
  { value: "eggs", label: "Eggs", description: "Food allergy" },
  { value: "nuts", label: "Tree Nuts", description: "Food allergy" },
  { value: "peanuts", label: "Peanuts", description: "Food allergy" },
  { value: "shellfish", label: "Shellfish", description: "Food allergy" },
  { value: "dairy", label: "Dairy/Milk", description: "Food allergy" },
  { value: "soy", label: "Soy", description: "Food allergy" },
  { value: "wheat", label: "Wheat/Gluten", description: "Food allergy" },
  { value: "environmental", label: "Environmental Allergies", description: "Pollen, dust, etc." },
  { value: "anesthesia", label: "Anesthesia", description: "Anesthetic allergy" }
];

const familyHistoryOptions: Option[] = [
  { value: "infertility", label: "Infertility", description: "Family history of fertility issues" },
  { value: "miscarriage", label: "Recurrent Miscarriage", description: "Multiple pregnancy losses" },
  { value: "genetic-disorders", label: "Genetic Disorders", description: "Inherited conditions" },
  { value: "birth-defects", label: "Birth Defects", description: "Congenital abnormalities" },
  { value: "cancer-breast", label: "Breast Cancer", description: "Family history of breast cancer" },
  { value: "cancer-ovarian", label: "Ovarian Cancer", description: "Family history of ovarian cancer" },
  { value: "cancer-uterine", label: "Uterine Cancer", description: "Family history of uterine cancer" },
  { value: "cancer-prostate", label: "Prostate Cancer", description: "Family history of prostate cancer" },
  { value: "diabetes", label: "Diabetes", description: "Family history of diabetes" },
  { value: "heart-disease", label: "Heart Disease", description: "Cardiovascular disease" },
  { value: "hypertension", label: "High Blood Pressure", description: "Hypertension" },
  { value: "thyroid", label: "Thyroid Disorders", description: "Thyroid conditions" },
  { value: "autoimmune", label: "Autoimmune Disorders", description: "Immune system disorders" },
  { value: "mental-health", label: "Mental Health", description: "Depression, anxiety, etc." },
  { value: "blood-clots", label: "Blood Clotting Disorders", description: "Thrombophilia" },
  { value: "twins", label: "Multiple Births", description: "Twins, triplets, etc." }
];

const surgicalHistoryOptions: Option[] = [
  { value: "appendectomy", label: "Appendectomy", description: "Appendix removal" },
  { value: "gallbladder", label: "Cholecystectomy", description: "Gallbladder removal" },
  { value: "cesarean", label: "Cesarean Section", description: "C-section delivery" },
  { value: "d-and-c", label: "D&C", description: "Dilation and curettage" },
  { value: "laparoscopy", label: "Laparoscopy", description: "Minimally invasive surgery" },
  { value: "hysteroscopy", label: "Hysteroscopy", description: "Uterine cavity surgery" },
  { value: "myomectomy", label: "Myomectomy", description: "Fibroid removal" },
  { value: "ovarian-cyst", label: "Ovarian Cyst Removal", description: "Cystectomy" },
  { value: "tubal-ligation", label: "Tubal Ligation", description: "Tubes tied" },
  { value: "tubal-reversal", label: "Tubal Reversal", description: "Tubal ligation reversal" },
  { value: "endometriosis", label: "Endometriosis Surgery", description: "Endometrial tissue removal" },
  { value: "hernia", label: "Hernia Repair", description: "Hernia surgery" },
  { value: "thyroid", label: "Thyroid Surgery", description: "Thyroidectomy" },
  { value: "breast", label: "Breast Surgery", description: "Breast procedures" },
  { value: "cardiac", label: "Cardiac Surgery", description: "Heart surgery" },
  { value: "orthopedic", label: "Orthopedic Surgery", description: "Bone/joint surgery" }
];

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
      previousTreatments: [],
      medicalConditions: [],
      medications: [],
      allergies: [],
      familyHistory: [],
      surgicalHistory: [],
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
      {/* Back to Home Button */}
      <BackToHome position="top-left" />

      <div className="max-w-4xl mx-auto mb-4">
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
                        <FormControl>
                          <MultiSelect
                            options={previousTreatmentOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select all previous treatments..."
                            searchable={true}
                          />
                        </FormControl>
                        <FormDescription>
                          Select all fertility treatments you have tried before. You can select multiple options.
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
                        <FormLabel>Medical Conditions</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={medicalConditionOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select all relevant medical conditions..."
                            searchable={true}
                          />
                        </FormControl>
                        <FormDescription>
                          Select all medical conditions that may affect fertility or treatment. You can select multiple conditions.
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
                          <FormLabel>Current Medications & Supplements</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={medicationOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select all current medications..."
                              searchable={true}
                            />
                          </FormControl>
                          <FormDescription>
                            Include all medications, supplements, and vitamins you are currently taking.
                          </FormDescription>
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
                          <FormControl>
                            <MultiSelect
                              options={allergyOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Select all known allergies..."
                              searchable={true}
                            />
                          </FormControl>
                          <FormDescription>
                            Include drug allergies, food allergies, and environmental allergies.
                          </FormDescription>
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
                        <FormControl>
                          <MultiSelect
                            options={familyHistoryOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select relevant family history..."
                            searchable={true}
                          />
                        </FormControl>
                        <FormDescription>
                          Include significant medical conditions in immediate family members (parents, siblings, grandparents).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={medicalHistoryForm.control}
                    name="surgicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgical History</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={surgicalHistoryOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select all previous surgeries..."
                            searchable={true}
                          />
                        </FormControl>
                        <FormDescription>
                          Include all surgeries and procedures you have had, especially those related to reproductive health.
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
    </div>
  );
};

export default PatientOnboarding;
