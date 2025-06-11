import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Copy,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Home,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  date: Date | undefined;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

interface Intervention {
  id: string;
  title: string;
  type: "emotional" | "financial" | "clinical";
  description: string;
}

interface TreatmentPlan {
  id: string;
  title: string;
  patientId: string;
  patientName: string;
  description: string;
  milestones: Milestone[];
  interventions: Intervention[];
  createdAt: Date;
  updatedAt: Date;
}

const treatmentTemplates = [
  {
    id: "template-1",
    title: "Standard IVF Treatment Plan",
    description:
      "A comprehensive plan for patients undergoing standard IVF treatment with detailed milestone tracking and support interventions.",
    milestones: [
      {
        id: "m1",
        title: "Initial Consultation & Assessment",
        date: undefined,
        description:
          "Comprehensive fertility assessment, medical history review, and treatment planning",
        status: "pending" as const,
      },
      {
        id: "m2",
        title: "Pre-treatment Counseling",
        date: undefined,
        description:
          "Psychological preparation, expectation setting, and consent process",
        status: "pending" as const,
      },
      {
        id: "m3",
        title: "Baseline Monitoring",
        date: undefined,
        description:
          "Baseline ultrasound, blood work, and cycle synchronization",
        status: "pending" as const,
      },
      {
        id: "m4",
        title: "Ovarian Stimulation Start",
        date: undefined,
        description: "Begin hormone medications and injection training",
        status: "pending" as const,
      },
      {
        id: "m5",
        title: "Stimulation Monitoring",
        date: undefined,
        description: "Regular ultrasounds and hormone level monitoring",
        status: "pending" as const,
      },
      {
        id: "m6",
        title: "Trigger Shot Administration",
        date: undefined,
        description: "Final maturation trigger and timing for egg retrieval",
        status: "pending" as const,
      },
      {
        id: "m7",
        title: "Egg Retrieval Procedure",
        date: undefined,
        description: "Surgical procedure to collect mature eggs",
        status: "pending" as const,
      },
      {
        id: "m8",
        title: "Fertilization & Embryo Culture",
        date: undefined,
        description:
          "Laboratory fertilization and embryo development monitoring",
        status: "pending" as const,
      },
      {
        id: "m9",
        title: "Embryo Transfer",
        date: undefined,
        description: "Transfer of selected embryos to the uterus",
        status: "pending" as const,
      },
      {
        id: "m10",
        title: "Post-Transfer Care",
        date: undefined,
        description: "Luteal phase support and activity guidelines",
        status: "pending" as const,
      },
      {
        id: "m11",
        title: "Pregnancy Test",
        date: undefined,
        description: "Beta hCG blood test to confirm pregnancy",
        status: "pending" as const,
      },
      {
        id: "m12",
        title: "Follow-up & Next Steps",
        date: undefined,
        description: "Result discussion and planning for next steps",
        status: "pending" as const,
      },
    ],
    interventions: [
      {
        id: "i1",
        title: "Comprehensive Emotional Support",
        type: "emotional" as const,
        description:
          "Weekly individual counseling sessions, stress management techniques, and coping strategies throughout treatment",
      },
      {
        id: "i2",
        title: "Financial Planning & Support",
        type: "financial" as const,
        description:
          "Detailed cost breakdown, insurance navigation, EMI options, and government scheme assistance",
      },
      {
        id: "i3",
        title: "Nutritional Optimization",
        type: "clinical" as const,
        description:
          "Personalized diet plan, supplement recommendations, and lifestyle modifications for fertility enhancement",
      },
      {
        id: "i4",
        title: "Partner Support Program",
        type: "emotional" as const,
        description:
          "Joint counseling sessions, communication strategies, and partner education about the IVF process",
      },
      {
        id: "i5",
        title: "Medication Management",
        type: "clinical" as const,
        description:
          "Injection training, medication scheduling, side effect monitoring, and compliance support",
      },
    ],
  },
  {
    id: "template-2",
    title: "IVF with ICSI Treatment Plan",
    description:
      "Comprehensive treatment plan for patients requiring Intracytoplasmic Sperm Injection due to male factor infertility.",
    milestones: [
      {
        id: "m1",
        title: "Comprehensive Fertility Assessment",
        date: undefined,
        description:
          "Detailed evaluation of both partners including semen analysis and female fertility testing",
        status: "pending" as const,
      },
      {
        id: "m2",
        title: "Male Factor Counseling",
        date: undefined,
        description:
          "Specialized counseling addressing male infertility concerns and treatment options",
        status: "pending" as const,
      },
      {
        id: "m3",
        title: "Sperm Preparation Optimization",
        date: undefined,
        description:
          "Lifestyle modifications and treatments to improve sperm quality before ICSI",
        status: "pending" as const,
      },
      {
        id: "m4",
        title: "Synchronized Cycle Preparation",
        date: undefined,
        description:
          "Coordinating female cycle preparation with optimal sperm collection timing",
        status: "pending" as const,
      },
      {
        id: "m5",
        title: "Ovarian Stimulation Protocol",
        date: undefined,
        description:
          "Controlled ovarian hyperstimulation with regular monitoring",
        status: "pending" as const,
      },
      {
        id: "m6",
        title: "Egg Retrieval & Sperm Collection",
        date: undefined,
        description:
          "Simultaneous egg retrieval and fresh sperm collection for ICSI procedure",
        status: "pending" as const,
      },
      {
        id: "m7",
        title: "ICSI Fertilization Procedure",
        date: undefined,
        description: "Microinjection of single sperm into each mature egg",
        status: "pending" as const,
      },
      {
        id: "m8",
        title: "Embryo Development Monitoring",
        date: undefined,
        description:
          "Daily assessment of embryo development and quality grading",
        status: "pending" as const,
      },
      {
        id: "m9",
        title: "Embryo Selection & Transfer",
        date: undefined,
        description: "Selection of best quality embryos for transfer",
        status: "pending" as const,
      },
      {
        id: "m10",
        title: "Luteal Phase Support",
        date: undefined,
        description: "Hormonal support to maintain pregnancy after transfer",
        status: "pending" as const,
      },
      {
        id: "m11",
        title: "Pregnancy Confirmation",
        date: undefined,
        description: "Beta hCG testing and early pregnancy monitoring",
        status: "pending" as const,
      },
      {
        id: "m12",
        title: "Outcome Review & Planning",
        date: undefined,
        description: "Result analysis and future treatment planning if needed",
        status: "pending" as const,
      },
    ],
    interventions: [
      {
        id: "i1",
        title: "Male Factor Infertility Support",
        type: "emotional" as const,
        description:
          "Specialized counseling for male partners dealing with infertility diagnosis and self-esteem issues",
      },
      {
        id: "i2",
        title: "Couple's Communication Therapy",
        type: "emotional" as const,
        description:
          "Joint sessions to improve communication and mutual support during treatment",
      },
      {
        id: "i3",
        title: "ICSI Financial Planning",
        type: "financial" as const,
        description:
          "Detailed cost analysis for ICSI procedures and assistance with financial planning",
      },
      {
        id: "i4",
        title: "Sperm Health Optimization",
        type: "clinical" as const,
        description:
          "Comprehensive program to improve sperm parameters through lifestyle and medical interventions",
      },
      {
        id: "i5",
        title: "Advanced Reproductive Technology Education",
        type: "clinical" as const,
        description:
          "Detailed explanation of ICSI procedure, success rates, and alternative options",
      },
    ],
  },
  {
    id: "template-3",
    title: "Frozen Embryo Transfer (FET) Plan",
    description:
      "Comprehensive plan for patients using previously frozen embryos with optimized endometrial preparation.",
    milestones: [
      {
        id: "m1",
        title: "Pre-FET Consultation",
        date: undefined,
        description:
          "Review of previous cycle, embryo quality assessment, and FET planning",
        status: "pending" as const,
      },
      {
        id: "m2",
        title: "Cycle Synchronization",
        date: undefined,
        description:
          "Menstrual cycle regulation and timing optimization for FET",
        status: "pending" as const,
      },
      {
        id: "m3",
        title: "Endometrial Preparation Start",
        date: undefined,
        description:
          "Begin estrogen supplementation for endometrial thickening",
        status: "pending" as const,
      },
      {
        id: "m4",
        title: "Mid-Cycle Monitoring",
        date: undefined,
        description:
          "Ultrasound assessment of endometrial thickness and pattern",
        status: "pending" as const,
      },
      {
        id: "m5",
        title: "Progesterone Initiation",
        date: undefined,
        description:
          "Start progesterone supplementation for luteal phase support",
        status: "pending" as const,
      },
      {
        id: "m6",
        title: "Final Lining Assessment",
        date: undefined,
        description:
          "Final ultrasound to confirm optimal endometrial preparation",
        status: "pending" as const,
      },
      {
        id: "m7",
        title: "Embryo Thawing Process",
        date: undefined,
        description: "Careful thawing of selected frozen embryos",
        status: "pending" as const,
      },
      {
        id: "m8",
        title: "Embryo Viability Assessment",
        date: undefined,
        description: "Post-thaw embryo evaluation and selection for transfer",
        status: "pending" as const,
      },
      {
        id: "m9",
        title: "Frozen Embryo Transfer",
        date: undefined,
        description: "Transfer of thawed embryos to prepared endometrium",
        status: "pending" as const,
      },
      {
        id: "m10",
        title: "Post-Transfer Monitoring",
        date: undefined,
        description: "Continued luteal phase support and activity guidelines",
        status: "pending" as const,
      },
      {
        id: "m11",
        title: "Pregnancy Test",
        date: undefined,
        description: "Beta hCG blood test to confirm implantation",
        status: "pending" as const,
      },
      {
        id: "m12",
        title: "Follow-up & Future Planning",
        date: undefined,
        description:
          "Result discussion and planning for remaining embryos if applicable",
        status: "pending" as const,
      },
    ],
    interventions: [
      {
        id: "i1",
        title: "Stress Management Program",
        type: "emotional" as const,
        description:
          "Comprehensive stress reduction including mindfulness, meditation, and relaxation techniques",
      },
      {
        id: "i2",
        title: "FET Financial Counseling",
        type: "financial" as const,
        description:
          "Cost analysis for FET cycles and insurance benefit optimization",
      },
      {
        id: "i3",
        title: "Hormonal Support Optimization",
        type: "clinical" as const,
        description:
          "Personalized progesterone and estrogen supplementation protocols",
      },
      {
        id: "i4",
        title: "Lifestyle Optimization",
        type: "clinical" as const,
        description:
          "Diet, exercise, and lifestyle modifications to support implantation",
      },
      {
        id: "i5",
        title: "Emotional Preparation",
        type: "emotional" as const,
        description:
          "Counseling to address hopes, fears, and expectations for FET cycle",
      },
    ],
  },
  {
    id: "template-4",
    title: "PCOS-Specific IVF Protocol",
    description:
      "Specialized treatment plan for patients with Polycystic Ovary Syndrome requiring careful ovarian stimulation.",
    milestones: [
      {
        id: "m1",
        title: "PCOS Assessment & Optimization",
        date: undefined,
        description:
          "Comprehensive PCOS evaluation and metabolic optimization before IVF",
        status: "pending" as const,
      },
      {
        id: "m2",
        title: "Insulin Resistance Management",
        date: undefined,
        description:
          "Metformin therapy and dietary modifications for insulin sensitivity",
        status: "pending" as const,
      },
      {
        id: "m3",
        title: "Weight Management Program",
        date: undefined,
        description:
          "Structured weight loss program if BMI optimization is needed",
        status: "pending" as const,
      },
      {
        id: "m4",
        title: "Gentle Stimulation Protocol",
        date: undefined,
        description:
          "Low-dose stimulation protocol to prevent OHSS in PCOS patients",
        status: "pending" as const,
      },
      {
        id: "m5",
        title: "Frequent Monitoring",
        date: undefined,
        description:
          "Intensive monitoring to prevent ovarian hyperstimulation syndrome",
        status: "pending" as const,
      },
      {
        id: "m6",
        title: "Trigger Timing Optimization",
        date: undefined,
        description: "Careful timing of trigger shot to optimize egg maturity",
        status: "pending" as const,
      },
      {
        id: "m7",
        title: "Egg Retrieval with OHSS Prevention",
        date: undefined,
        description: "Egg collection with protocols to minimize OHSS risk",
        status: "pending" as const,
      },
      {
        id: "m8",
        title: "Freeze-All Strategy",
        date: undefined,
        description: "Embryo freezing to allow for optimal transfer timing",
        status: "pending" as const,
      },
      {
        id: "m9",
        title: "Recovery & Preparation",
        date: undefined,
        description:
          "Recovery period and preparation for frozen embryo transfer",
        status: "pending" as const,
      },
      {
        id: "m10",
        title: "Optimized FET Cycle",
        date: undefined,
        description: "Frozen embryo transfer in optimized cycle",
        status: "pending" as const,
      },
    ],
    interventions: [
      {
        id: "i1",
        title: "PCOS Education & Support",
        type: "emotional" as const,
        description:
          "Comprehensive education about PCOS and its impact on fertility treatment",
      },
      {
        id: "i2",
        title: "Nutritional Counseling",
        type: "clinical" as const,
        description:
          "Specialized PCOS diet plan and nutritional supplementation",
      },
      {
        id: "i3",
        title: "Exercise Program",
        type: "clinical" as const,
        description:
          "Structured exercise program to improve insulin sensitivity",
      },
      {
        id: "i4",
        title: "Metabolic Monitoring",
        type: "clinical" as const,
        description:
          "Regular monitoring of metabolic parameters throughout treatment",
      },
    ],
  },
  {
    id: "template-5",
    title: "Advanced Maternal Age IVF Plan",
    description:
      "Specialized protocol for women over 35 with age-related fertility challenges.",
    milestones: [
      {
        id: "m1",
        title: "Comprehensive Age-Related Assessment",
        date: undefined,
        description:
          "Detailed evaluation of ovarian reserve and age-related fertility factors",
        status: "pending" as const,
      },
      {
        id: "m2",
        title: "Genetic Counseling",
        date: undefined,
        description:
          "Discussion of age-related genetic risks and testing options",
        status: "pending" as const,
      },
      {
        id: "m3",
        title: "Optimized Stimulation Protocol",
        date: undefined,
        description:
          "Individualized stimulation based on ovarian reserve testing",
        status: "pending" as const,
      },
      {
        id: "m4",
        title: "Enhanced Monitoring",
        date: undefined,
        description: "Frequent monitoring to optimize follicle development",
        status: "pending" as const,
      },
      {
        id: "m5",
        title: "Egg Quality Assessment",
        date: undefined,
        description: "Evaluation of egg quality and maturity at retrieval",
        status: "pending" as const,
      },
      {
        id: "m6",
        title: "Preimplantation Genetic Testing",
        date: undefined,
        description: "PGT-A testing to screen for chromosomal abnormalities",
        status: "pending" as const,
      },
      {
        id: "m7",
        title: "Embryo Selection & Transfer",
        date: undefined,
        description: "Transfer of genetically normal embryos",
        status: "pending" as const,
      },
    ],
    interventions: [
      {
        id: "i1",
        title: "Age-Related Counseling",
        type: "emotional" as const,
        description:
          "Support for anxiety and concerns related to advanced maternal age",
      },
      {
        id: "i2",
        title: "Antioxidant Supplementation",
        type: "clinical" as const,
        description: "Targeted supplements to improve egg quality",
      },
      {
        id: "i3",
        title: "Lifestyle Optimization",
        type: "clinical" as const,
        description:
          "Comprehensive lifestyle modifications to support fertility",
      },
    ],
  },
];

const mockPatients = [
  {
    id: "p1",
    name: "Priya Sharma",
    age: 34,
    diagnosis: "PCOS",
    status: "Active",
  },
  {
    id: "p2",
    name: "Arjun Patel",
    age: 36,
    diagnosis: "Male Factor",
    status: "Active",
  },
  {
    id: "p3",
    name: "Kavya Reddy",
    age: 32,
    diagnosis: "Unexplained",
    status: "New",
  },
  {
    id: "p4",
    name: "Rohit Gupta",
    age: 38,
    diagnosis: "Endometriosis",
    status: "Active",
  },
  {
    id: "p5",
    name: "Ananya Singh",
    age: 29,
    diagnosis: "Blocked Tubes",
    status: "Active",
  },
  {
    id: "p6",
    name: "Vikram Joshi",
    age: 41,
    diagnosis: "Low Sperm Count",
    status: "Active",
  },
  {
    id: "p7",
    name: "Meera Nair",
    age: 35,
    diagnosis: "Ovulation Disorders",
    status: "New",
  },
  {
    id: "p8",
    name: "Karan Malhotra",
    age: 33,
    diagnosis: "Genetic Factors",
    status: "Active",
  },
];

const TreatmentPlanCreator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [planTitle, setPlanTitle] = useState<string>("");
  const [planDescription, setPlanDescription] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    status: "pending",
  });
  const [newIntervention, setNewIntervention] = useState<Partial<Intervention>>(
    { title: "", type: "emotional", description: "" },
  );
  const [activeTab, setActiveTab] = useState<string>("template");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedPlans, setSavedPlans] = useState<TreatmentPlan[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<string | null>(
    null,
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Load saved plans from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("treatmentPlans");
    if (saved) {
      try {
        const plans = JSON.parse(saved).map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          updatedAt: new Date(plan.updatedAt),
          milestones: plan.milestones.map((m: any) => ({
            ...m,
            date: m.date ? new Date(m.date) : undefined,
          })),
        }));
        setSavedPlans(plans);
      } catch (error) {
        console.error("Error loading saved plans:", error);
        // Clear corrupted data
        localStorage.removeItem("treatmentPlans");
      }
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (
      planTitle ||
      planDescription ||
      milestones.length > 0 ||
      interventions.length > 0
    ) {
      const autoSaveData = {
        selectedTemplate,
        selectedPatient,
        planTitle,
        planDescription,
        milestones: milestones.map((m) => ({
          ...m,
          date: m.date ? m.date.toISOString() : undefined,
        })),
        interventions,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("treatmentPlanDraft", JSON.stringify(autoSaveData));
    }
  }, [
    selectedTemplate,
    selectedPatient,
    planTitle,
    planDescription,
    milestones,
    interventions,
  ]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem("treatmentPlanDraft");
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        // Only load if it's recent (within 24 hours)
        const draftTime = new Date(draftData.timestamp);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - draftTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setSelectedTemplate(draftData.selectedTemplate || "");
          setSelectedPatient(draftData.selectedPatient || "");
          setPlanTitle(draftData.planTitle || "");
          setPlanDescription(draftData.planDescription || "");
          setMilestones(
            draftData.milestones?.map((m: any) => ({
              ...m,
              date: m.date ? new Date(m.date) : undefined,
            })) || [],
          );
          setInterventions(draftData.interventions || []);

          if (draftData.planTitle || draftData.milestones?.length > 0) {
            setActiveTab("customize");
          }
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        localStorage.removeItem("treatmentPlanDraft");
      }
    }
  }, []);

  // Validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!selectedPatient) errors.patient = "Please select a patient";
    if (!planTitle.trim()) errors.title = "Plan title is required";
    if (!planDescription.trim())
      errors.description = "Plan description is required";
    if (milestones.length === 0)
      errors.milestones = "At least one milestone is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = treatmentTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setPlanTitle(template.title);
      setPlanDescription(template.description);
      setMilestones(
        template.milestones.map((m, index) => ({
          ...m,
          id: `milestone-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );
      setInterventions(
        template.interventions.map((i, index) => ({
          ...i,
          id: `intervention-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      );
      setValidationErrors({});
      setActiveTab("customize");
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.title?.trim() && newMilestone.description?.trim()) {
      const milestone: Milestone = {
        id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newMilestone.title.trim(),
        date: newMilestone.date,
        description: newMilestone.description.trim(),
        status:
          (newMilestone.status as "pending" | "in-progress" | "completed") ||
          "pending",
      };
      setMilestones([...milestones, milestone]);
      setNewMilestone({ title: "", description: "", status: "pending" });
      // Clear validation error if milestones were required
      if (validationErrors.milestones) {
        setValidationErrors((prev) => ({ ...prev, milestones: "" }));
      }
    }
  };

  const handleAddIntervention = () => {
    if (newIntervention.title?.trim() && newIntervention.description?.trim()) {
      const intervention: Intervention = {
        id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: newIntervention.title.trim(),
        type:
          (newIntervention.type as "emotional" | "financial" | "clinical") ||
          "emotional",
        description: newIntervention.description.trim(),
      };
      setInterventions([...interventions, intervention]);
      setNewIntervention({ title: "", type: "emotional", description: "" });
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
    // If editing this milestone, clear the editing state
    if (editingMilestone === id) {
      setEditingMilestone(null);
    }
  };

  const handleRemoveIntervention = (id: string) => {
    setInterventions(interventions.filter((i) => i.id !== id));
    // If editing this intervention, clear the editing state
    if (editingIntervention === id) {
      setEditingIntervention(null);
    }
  };

  const handleSavePlan = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const plan: TreatmentPlan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: planTitle.trim(),
        patientId: selectedPatient,
        patientName:
          mockPatients.find((p) => p.id === selectedPatient)?.name || "",
        description: planDescription.trim(),
        milestones: milestones.map((m) => ({
          ...m,
          id:
            m.id ||
            `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
        interventions: interventions.map((i) => ({
          ...i,
          id:
            i.id ||
            `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to localStorage (in real app, this would be an API call)
      const updatedPlans = [...savedPlans, plan];
      setSavedPlans(updatedPlans);
      // Serialize dates properly for localStorage
      const serializedPlans = updatedPlans.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        milestones: p.milestones.map((m) => ({
          ...m,
          date: m.date ? m.date.toISOString() : undefined,
        })),
      }));
      localStorage.setItem("treatmentPlans", JSON.stringify(serializedPlans));

      // Clear draft after successful save
      localStorage.removeItem("treatmentPlanDraft");

      // Reset form
      setSelectedTemplate("");
      setSelectedPatient("");
      setPlanTitle("");
      setPlanDescription("");
      setMilestones([]);
      setInterventions([]);
      setValidationErrors({});
      setEditingMilestone(null);
      setEditingIntervention(null);
      setNewMilestone({ title: "", description: "", status: "pending" });
      setNewIntervention({ title: "", type: "emotional", description: "" });
      setActiveTab("template");

      // Show success message (in a real app, you'd use a toast notification)
      console.log("Treatment plan saved successfully!", plan);
      alert("Treatment plan saved successfully!");
    } catch (error) {
      console.error("Error saving treatment plan:", error);
      alert("Error saving treatment plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMilestoneDateChange = (id: string, date: Date | undefined) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, date } : m)));
  };

  const handleMilestoneStatusChange = (
    id: string,
    status: "pending" | "in-progress" | "completed",
  ) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const handleEditMilestone = (id: string, field: string, value: string) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const handleEditIntervention = (id: string, field: string, value: string) => {
    setInterventions(
      interventions.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );
  };

  const handleEditInterventionType = (
    id: string,
    type: "emotional" | "financial" | "clinical",
  ) => {
    setInterventions(
      interventions.map((i) => (i.id === id ? { ...i, type } : i)),
    );
  };

  const handleDuplicateMilestone = (milestone: Milestone) => {
    const duplicated = {
      ...milestone,
      id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${milestone.title} (Copy)`,
      status: "pending" as const,
      date: undefined,
    };
    setMilestones([...milestones, duplicated]);
  };

  const handleDuplicateIntervention = (intervention: Intervention) => {
    const duplicated = {
      ...intervention,
      id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${intervention.title} (Copy)`,
    };
    setInterventions([...interventions, duplicated]);
  };

  const handleClearForm = () => {
    if (
      confirm(
        "Are you sure you want to clear all form data? This action cannot be undone.",
      )
    ) {
      setSelectedTemplate("");
      setSelectedPatient("");
      setPlanTitle("");
      setPlanDescription("");
      setMilestones([]);
      setInterventions([]);
      setValidationErrors({});
      setEditingMilestone(null);
      setEditingIntervention(null);
      setNewMilestone({ title: "", description: "", status: "pending" });
      setNewIntervention({ title: "", type: "emotional", description: "" });
      localStorage.removeItem("treatmentPlanDraft");
      setActiveTab("template");
    }
  };

  const handleLoadPlan = (plan: TreatmentPlan) => {
    if (
      confirm("Loading this plan will replace your current work. Continue?")
    ) {
      setSelectedPatient(plan.patientId);
      setPlanTitle(plan.title);
      setPlanDescription(plan.description);
      setMilestones([...plan.milestones]);
      setInterventions([...plan.interventions]);
      setValidationErrors({});
      setActiveTab("customize");
    }
  };

  const handleDeletePlan = (planId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this treatment plan? This action cannot be undone.",
      )
    ) {
      const updatedPlans = savedPlans.filter((p) => p.id !== planId);
      setSavedPlans(updatedPlans);
      const serializedPlans = updatedPlans.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        milestones: p.milestones.map((m) => ({
          ...m,
          date: m.date ? m.date.toISOString() : undefined,
        })),
      }));
      localStorage.setItem("treatmentPlans", JSON.stringify(serializedPlans));
    }
  };

  const handleExportPlan = (plan: TreatmentPlan) => {
    const exportData = {
      ...plan,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `treatment-plan-${plan.patientName.replace(/\s+/g, "-").toLowerCase()}-${format(plan.createdAt, "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getInterventionColor = (type: string) => {
    switch (type) {
      case "emotional":
        return "default";
      case "financial":
        return "secondary";
      case "clinical":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm w-full max-w-7xl mx-auto">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Treatment Plan Creator
        </h1>
        <p className="text-muted-foreground mt-2">
          Create customized treatment plans based on ESHRE guidelines with
          milestone tracking and intervention suggestions.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6">
          <TabsTrigger value="template">Select Template</TabsTrigger>
          <TabsTrigger value="customize">Customize Plan</TabsTrigger>
          <TabsTrigger value="review">Review & Save</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatmentTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardHeader>
                  <CardTitle>{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Includes:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>{template.milestones.length} milestones</li>
                      <li>
                        {template.interventions.length} suggested interventions
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="w-full"
                  >
                    Select Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customize" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>
                Customize the basic information for this treatment plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient</Label>
                  <Select
                    value={selectedPatient}
                    onValueChange={(value) => {
                      setSelectedPatient(value);
                      if (validationErrors.patient) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          patient: "",
                        }));
                      }
                    }}
                  >
                    <SelectTrigger
                      id="patient"
                      className={
                        validationErrors.patient ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.patient && (
                    <p className="text-sm text-red-500">
                      {validationErrors.patient}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Plan Title</Label>
                  <Input
                    id="title"
                    value={planTitle}
                    onChange={(e) => {
                      setPlanTitle(e.target.value);
                      if (validationErrors.title) {
                        setValidationErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                    placeholder="Enter plan title"
                    className={validationErrors.title ? "border-red-500" : ""}
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-red-500">
                      {validationErrors.title}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Plan Description</Label>
                <Textarea
                  id="description"
                  value={planDescription}
                  onChange={(e) => {
                    setPlanDescription(e.target.value);
                    if (validationErrors.description) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        description: "",
                      }));
                    }
                  }}
                  placeholder="Enter plan description"
                  rows={3}
                  className={
                    validationErrors.description ? "border-red-500" : ""
                  }
                />
                {validationErrors.description && (
                  <p className="text-sm text-red-500">
                    {validationErrors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Milestones</CardTitle>
              <CardDescription>
                Define key milestones in the treatment journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 p-4 border rounded-lg bg-background relative group hover:shadow-sm transition-shadow"
                    >
                      <div className="mt-1">
                        <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            {editingMilestone === milestone.id ? (
                              <Input
                                value={milestone.title}
                                onChange={(e) =>
                                  handleEditMilestone(
                                    milestone.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingMilestone(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    setEditingMilestone(null);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    setEditingMilestone(null);
                                  }
                                }}
                                className="font-medium"
                                autoFocus
                              />
                            ) : (
                              <div
                                className="font-medium cursor-pointer hover:text-primary flex items-center gap-2"
                                onClick={() =>
                                  setEditingMilestone(milestone.id)
                                }
                              >
                                {getStatusIcon(milestone.status)}
                                {milestone.title}
                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                            {editingMilestone === milestone.id ? (
                              <Textarea
                                value={milestone.description}
                                onChange={(e) =>
                                  handleEditMilestone(
                                    milestone.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingMilestone(null)}
                                rows={2}
                                className="text-sm"
                              />
                            ) : (
                              <p
                                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                                onClick={() =>
                                  setEditingMilestone(milestone.id)
                                }
                              >
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Select
                              value={milestone.status}
                              onValueChange={(value) =>
                                handleMilestoneStatusChange(
                                  milestone.id,
                                  value as any,
                                )
                              }
                            >
                              <SelectTrigger className="w-auto h-8">
                                <Badge
                                  variant={
                                    getStatusColor(milestone.status) as any
                                  }
                                >
                                  {milestone.status === "pending"
                                    ? "Pending"
                                    : milestone.status === "in-progress"
                                      ? "In Progress"
                                      : "Completed"}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-auto"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {milestone.date
                                    ? format(milestone.date, "MMM dd")
                                    : "Set date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={milestone.date}
                                  onSelect={(date) =>
                                    handleMilestoneDateChange(
                                      milestone.id,
                                      date,
                                    )
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDuplicateMilestone(milestone)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                              title="Duplicate milestone"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveMilestone(milestone.id)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              title="Delete milestone"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              {validationErrors.milestones && (
                <p className="text-sm text-red-500">
                  {validationErrors.milestones}
                </p>
              )}

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Add New Milestone</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone-title">Title</Label>
                    <Input
                      id="milestone-title"
                      value={newMilestone.title}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          title: e.target.value,
                        })
                      }
                      placeholder="Milestone title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone-status">Status</Label>
                    <Select
                      value={newMilestone.status}
                      onValueChange={(value) =>
                        setNewMilestone({
                          ...newMilestone,
                          status: value as any,
                        })
                      }
                    >
                      <SelectTrigger id="milestone-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestone-description">Description</Label>
                  <Textarea
                    id="milestone-description"
                    value={newMilestone.description}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe this milestone"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAddMilestone}
                  className="w-full"
                  disabled={
                    !newMilestone.title?.trim() ||
                    !newMilestone.description?.trim()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Milestone
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Interventions</CardTitle>
              <CardDescription>
                Add interventions based on ESHRE guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence>
                <div className="space-y-4">
                  {interventions.map((intervention) => (
                    <motion.div
                      key={intervention.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 p-4 border rounded-lg bg-background relative group hover:shadow-sm transition-shadow"
                    >
                      <div className="mt-1">
                        <DragHandleDots2Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            {editingIntervention === intervention.id ? (
                              <Input
                                value={intervention.title}
                                onChange={(e) =>
                                  handleEditIntervention(
                                    intervention.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingIntervention(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    setEditingIntervention(null);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    setEditingIntervention(null);
                                  }
                                }}
                                className="font-medium"
                                autoFocus
                              />
                            ) : (
                              <div
                                className="font-medium cursor-pointer hover:text-primary flex items-center gap-2"
                                onClick={() =>
                                  setEditingIntervention(intervention.id)
                                }
                              >
                                {intervention.title}
                                <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                            {editingIntervention === intervention.id ? (
                              <Textarea
                                value={intervention.description}
                                onChange={(e) =>
                                  handleEditIntervention(
                                    intervention.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingIntervention(null)}
                                rows={2}
                                className="text-sm"
                              />
                            ) : (
                              <p
                                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                                onClick={() =>
                                  setEditingIntervention(intervention.id)
                                }
                              >
                                {intervention.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Select
                              value={intervention.type}
                              onValueChange={(value) =>
                                handleEditInterventionType(
                                  intervention.id,
                                  value as
                                    | "emotional"
                                    | "financial"
                                    | "clinical",
                                )
                              }
                            >
                              <SelectTrigger className="w-auto h-8">
                                <Badge
                                  variant={
                                    getInterventionColor(
                                      intervention.type,
                                    ) as any
                                  }
                                >
                                  {intervention.type.charAt(0).toUpperCase() +
                                    intervention.type.slice(1)}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="emotional">
                                  Emotional
                                </SelectItem>
                                <SelectItem value="financial">
                                  Financial
                                </SelectItem>
                                <SelectItem value="clinical">
                                  Clinical
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDuplicateIntervention(intervention)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                              title="Duplicate intervention"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveIntervention(intervention.id)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              title="Delete intervention"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Add New Intervention</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="intervention-title">Title</Label>
                    <Input
                      id="intervention-title"
                      value={newIntervention.title}
                      onChange={(e) =>
                        setNewIntervention({
                          ...newIntervention,
                          title: e.target.value,
                        })
                      }
                      placeholder="Intervention title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intervention-type">Type</Label>
                    <Select
                      value={newIntervention.type}
                      onValueChange={(value) =>
                        setNewIntervention({
                          ...newIntervention,
                          type: value as any,
                        })
                      }
                    >
                      <SelectTrigger id="intervention-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emotional">Emotional</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="clinical">Clinical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intervention-description">Description</Label>
                  <Textarea
                    id="intervention-description"
                    value={newIntervention.description}
                    onChange={(e) =>
                      setNewIntervention({
                        ...newIntervention,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe this intervention"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAddIntervention}
                  className="w-full"
                  disabled={
                    !newIntervention.title?.trim() ||
                    !newIntervention.description?.trim()
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Intervention
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab("template")}
              >
                Back to Templates
              </Button>
              <Button variant="outline" onClick={handleClearForm}>
                Clear Form
              </Button>
            </div>
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("review");
                }
              }}
              className="px-8"
              disabled={
                !selectedPatient ||
                !planTitle.trim() ||
                !planDescription.trim() ||
                milestones.length === 0
              }
            >
              Continue to Review
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Treatment Plan</CardTitle>
              <CardDescription>
                Review the details of your treatment plan before saving
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Patient
                    </h3>
                    <p className="text-base">
                      {mockPatients.find((p) => p.id === selectedPatient)
                        ?.name || "No patient selected"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Plan Title
                    </h3>
                    <p className="text-base">{planTitle || "No title"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <p className="text-base">
                    {planDescription || "No description"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Milestones ({milestones.length})
                </h3>
                {milestones.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge
                            variant={
                              milestone.status === "completed"
                                ? "default"
                                : "outline"
                            }
                          >
                            {milestone.status === "pending"
                              ? "Pending"
                              : milestone.status === "in-progress"
                                ? "In Progress"
                                : "Completed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {milestone.description}
                        </p>
                        {milestone.date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(milestone.date, "PPP")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No milestones added</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Interventions ({interventions.length})
                </h3>
                {interventions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interventions.map((intervention) => (
                      <div
                        key={intervention.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{intervention.title}</h4>
                          <Badge
                            variant={
                              intervention.type === "emotional"
                                ? "default"
                                : intervention.type === "financial"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {intervention.type.charAt(0).toUpperCase() +
                              intervention.type.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {intervention.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No interventions added
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("customize")}
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleSavePlan}
                disabled={
                  !selectedPatient ||
                  !planTitle.trim() ||
                  !planDescription.trim() ||
                  milestones.length === 0 ||
                  isLoading
                }
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Treatment Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Treatment Plans</CardTitle>
              <CardDescription>
                View and manage previously saved treatment plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedPlans.length > 0 ? (
                <div className="space-y-4">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Patient: {plan.patientName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created: {format(plan.createdAt, "PPP")}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {plan.milestones.length} milestones
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {plan.interventions.length} interventions
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadPlan(plan)}
                          >
                            Load
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportPlan(plan)}
                          >
                            Export
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No saved treatment plans yet.
                  </p>
                  <Button onClick={() => setActiveTab("template")}>
                    Create Your First Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreatmentPlanCreator;
