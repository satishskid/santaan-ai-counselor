import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  PlusCircle,
  Share2,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Milestone {
  id: string;
  title: string;
  date: Date;
  status: "completed" | "upcoming" | "in-progress";
  notes?: string;
}

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  notes?: string;
}

interface Resource {
  id: string;
  title: string;
  type: "article" | "video" | "document";
  url: string;
  shared: boolean;
}

interface Note {
  id: string;
  date: Date;
  content: string;
}

const PatientProgressTracker = ({
  patientId = "p1",
  patientName = "Priya Sharma",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");

  // Mock data
  const milestones: Milestone[] = [
    {
      id: "1",
      title: "Initial Consultation",
      date: new Date(2023, 9, 15),
      status: "completed",
      notes:
        "Patient expressed concerns about financial aspects of treatment. Discussed insurance coverage and payment plans. Patient appears motivated but anxious about success rates.",
    },
    {
      id: "2",
      title: "Psychological Assessment",
      date: new Date(2023, 10, 2),
      status: "completed",
      notes:
        "Assessment completed. Patient shows moderate anxiety about treatment outcomes. Recommended stress management techniques and support group participation. Partner is very supportive.",
    },
    {
      id: "3",
      title: "Medical History Review",
      date: new Date(2023, 10, 8),
      status: "completed",
      notes:
        "Comprehensive medical history taken. PCOS diagnosis confirmed. Previous treatments reviewed. Lifestyle modifications discussed.",
    },
    {
      id: "4",
      title: "Treatment Plan Review",
      date: new Date(2023, 10, 20),
      status: "completed",
      notes:
        "Standard IVF protocol selected. Patient understands all steps. Medication schedule provided. Emergency contacts updated.",
    },
    {
      id: "5",
      title: "Pre-treatment Counseling",
      date: new Date(2023, 11, 5),
      status: "completed",
      notes:
        "Addressed remaining concerns about side effects. Discussed coping strategies. Patient feels ready to proceed.",
    },
    {
      id: "6",
      title: "Ovarian Stimulation Start",
      date: new Date(2023, 11, 12),
      status: "in-progress",
      notes:
        "Stimulation protocol initiated. Patient tolerating medications well. Regular monitoring scheduled.",
    },
    {
      id: "7",
      title: "Follicle Monitoring",
      date: new Date(2023, 11, 18),
      status: "upcoming",
    },
    {
      id: "8",
      title: "Egg Retrieval Preparation",
      date: new Date(2023, 11, 25),
      status: "upcoming",
    },
    {
      id: "9",
      title: "Egg Retrieval Procedure",
      date: new Date(2023, 11, 27),
      status: "upcoming",
    },
    {
      id: "10",
      title: "Fertilization Update",
      date: new Date(2023, 11, 28),
      status: "upcoming",
    },
    {
      id: "11",
      title: "Embryo Transfer",
      date: new Date(2023, 11, 30),
      status: "upcoming",
    },
    {
      id: "12",
      title: "Post-Transfer Care",
      date: new Date(2023, 12, 2),
      status: "upcoming",
    },
    {
      id: "13",
      title: "Pregnancy Test",
      date: new Date(2023, 12, 14),
      status: "upcoming",
    },
    {
      id: "14",
      title: "Follow-up Consultation",
      date: new Date(2023, 12, 20),
      status: "upcoming",
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "1",
      title: "Counseling Session",
      date: new Date(2023, 10, 25),
      time: "10:00 AM",
      notes:
        "Focus on coping strategies and stress management techniques. Discussed meditation apps and breathing exercises.",
    },
    {
      id: "2",
      title: "Financial Consultation",
      date: new Date(2023, 11, 5),
      time: "2:30 PM",
      notes:
        "Review insurance coverage and payment options. Discussed EMI plans and government schemes available.",
    },
    {
      id: "3",
      title: "Nutrition Counseling",
      date: new Date(2023, 11, 12),
      time: "11:00 AM",
      notes:
        "Dietary recommendations for PCOS management and fertility enhancement. Meal plan provided.",
    },
    {
      id: "4",
      title: "Support Group Session",
      date: new Date(2023, 11, 18),
      time: "4:00 PM",
      notes:
        "Group therapy session with other IVF patients. Sharing experiences and coping strategies.",
    },
    {
      id: "5",
      title: "Partner Counseling",
      date: new Date(2023, 11, 22),
      time: "3:00 PM",
      notes:
        "Joint session with partner to discuss emotional support and communication strategies.",
    },
    {
      id: "6",
      title: "Pre-Procedure Counseling",
      date: new Date(2023, 11, 26),
      time: "9:00 AM",
      notes:
        "Final preparation session before egg retrieval. Address any last-minute concerns.",
    },
    {
      id: "7",
      title: "Post-Transfer Support",
      date: new Date(2023, 12, 3),
      time: "2:00 PM",
      notes:
        "Emotional support during the two-week wait period. Relaxation techniques and positive visualization.",
    },
  ];

  const resources: Resource[] = [
    {
      id: "1",
      title: "Understanding IVF Emotional Journey",
      type: "article",
      url: "#",
      shared: true,
    },
    {
      id: "2",
      title: "Financial Planning for Fertility Treatment",
      type: "document",
      url: "#",
      shared: true,
    },
    {
      id: "3",
      title: "Relaxation Techniques for IVF Patients",
      type: "video",
      url: "#",
      shared: true,
    },
    {
      id: "4",
      title: "PCOS and Fertility: Complete Guide",
      type: "document",
      url: "#",
      shared: true,
    },
    {
      id: "5",
      title: "Nutrition During IVF Treatment",
      type: "article",
      url: "#",
      shared: true,
    },
    {
      id: "6",
      title: "Meditation for Fertility - Guided Sessions",
      type: "video",
      url: "#",
      shared: true,
    },
    {
      id: "7",
      title: "IVF Success Stories from India",
      type: "article",
      url: "#",
      shared: false,
    },
    {
      id: "8",
      title: "Insurance Coverage for IVF in India",
      type: "document",
      url: "#",
      shared: true,
    },
    {
      id: "9",
      title: "Exercise Guidelines During IVF",
      type: "article",
      url: "#",
      shared: false,
    },
    {
      id: "10",
      title: "Partner Support During Fertility Treatment",
      type: "video",
      url: "#",
      shared: true,
    },
    {
      id: "11",
      title: "Managing Work-Life Balance During IVF",
      type: "article",
      url: "#",
      shared: false,
    },
    {
      id: "12",
      title: "Understanding IVF Medications",
      type: "document",
      url: "#",
      shared: true,
    },
    {
      id: "13",
      title: "Acupuncture and IVF: Benefits and Risks",
      type: "article",
      url: "#",
      shared: false,
    },
    {
      id: "14",
      title: "Yoga for Fertility - Beginner Poses",
      type: "video",
      url: "#",
      shared: true,
    },
    {
      id: "15",
      title: "Coping with IVF Failure",
      type: "document",
      url: "#",
      shared: false,
    },
  ];

  const notes: Note[] = [
    {
      id: "1",
      date: new Date(2023, 9, 15),
      content:
        "Initial consultation completed. Patient expressed significant anxiety about the IVF process, particularly concerned about success rates and financial burden. Discussed realistic expectations and provided educational materials. Recommended starting with relaxation techniques and joining our support group. Patient appears motivated but will need ongoing emotional support throughout the journey.",
    },
    {
      id: "2",
      date: new Date(2023, 10, 2),
      content:
        "Psychological assessment session. Patient shows moderate anxiety levels but good coping mechanisms. Has been practicing mindfulness techniques daily as recommended. Partner is very supportive which is a positive factor. Discussed potential challenges during treatment and developed personalized coping strategies. Patient feels more confident about proceeding.",
    },
    {
      id: "3",
      date: new Date(2023, 10, 8),
      content:
        "Medical history review session. Detailed discussion about PCOS management and its impact on fertility. Patient has been following dietary recommendations and shows good understanding of her condition. Addressed concerns about medication side effects. Provided comprehensive information about the IVF process timeline.",
    },
    {
      id: "4",
      date: new Date(2023, 10, 20),
      content:
        "Treatment plan discussion. Patient and partner both present. Explained the standard IVF protocol in detail, including medication schedule, monitoring appointments, and procedures. Patient asked thoughtful questions about each step. Feels ready to proceed with treatment. Emergency contact information updated.",
    },
    {
      id: "5",
      date: new Date(2023, 11, 5),
      content:
        "Pre-treatment counseling session. Addressed remaining concerns about injection techniques and potential side effects. Patient practiced self-injection with saline. Discussed importance of medication compliance and timing. Reviewed signs and symptoms to watch for. Patient demonstrates good understanding and readiness.",
    },
    {
      id: "6",
      date: new Date(2023, 11, 12),
      content:
        "First week of stimulation check-in. Patient tolerating medications well with minimal side effects. Mood is stable, following stress management techniques. Partner continues to be supportive with injections. Discussed upcoming monitoring schedule and what to expect during follicle tracking phase.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <FileText className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Patient Progress Tracker</h1>
          <p className="text-gray-500">Tracking progress for {patientName}</p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={appointmentDialogOpen}
            onOpenChange={setAppointmentDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">Appointment Title</label>
                  <Input id="title" placeholder="Enter appointment title" />
                </div>
                <div className="grid gap-2">
                  <label>Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="time">Time</label>
                  <Input id="time" type="time" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="notes">Notes</label>
                  <Textarea id="notes" placeholder="Add appointment notes" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setAppointmentDialogOpen(false)}>
                  Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Session Note</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label>Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="note-content">Note Content</label>
                  <Textarea
                    id="note-content"
                    placeholder="Enter session notes"
                    rows={5}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setNoteDialogOpen(false)}>
                  Save Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Session Notes</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Journey Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex mb-8 relative">
                    <div
                      className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${milestone.status === "completed" ? "bg-green-500" : milestone.status === "in-progress" ? "bg-blue-500" : "bg-gray-300"} mr-4`}
                    >
                      {milestone.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Clock className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">
                          {milestone.title}
                        </h3>
                        <Badge
                          className={`ml-3 ${getStatusColor(milestone.status)}`}
                        >
                          {milestone.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(milestone.date, "MMMM d, yyyy")}
                      </p>
                      {milestone.notes && (
                        <p className="mt-2 text-gray-700">{milestone.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{appointment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {format(appointment.date, "MMMM d, yyyy")} at{" "}
                            {appointment.time}
                          </p>
                          {appointment.notes && (
                            <p className="mt-2 text-sm">{appointment.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No appointments scheduled
                </p>
              )}
              <div className="mt-4 flex justify-center">
                <Button onClick={() => setAppointmentDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {notes.map((note) => (
                  <div key={note.id} className="mb-6 p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {format(note.date, "MMMM d, yyyy")}
                      </h3>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </ScrollArea>
              <div className="mt-4 flex justify-center">
                <Button onClick={() => setNoteDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      {getResourceTypeIcon(resource.type)}
                      <div className="ml-3">
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {resource.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          View
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        {resource.shared ? "Shared" : "Share"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProgressTracker;
